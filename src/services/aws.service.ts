import "dotenv/config";
import {
  RekognitionClient,
  CreateCollectionCommand,
  DescribeCollectionCommand,
  IndexFacesCommand,
  SearchFacesByImageCommand,
} from "@aws-sdk/client-rekognition";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Support multiple env var names to match different deployments
const {
  AWS_REGION,
  REGION,
  REKOG_COLLECTION_ID,
  AWS_REKOG_COLLECTION_ID,
  REKOGNITION_COLLECTION_ID,
  S3_BUCKET_NAME,
  AWS_S3_BUCKET,
  BUCKET_NAME,
} = process.env;

const region = AWS_REGION || REGION;
const collectionId =
  REKOG_COLLECTION_ID || AWS_REKOG_COLLECTION_ID || REKOGNITION_COLLECTION_ID;
const bucketName = S3_BUCKET_NAME || AWS_S3_BUCKET || BUCKET_NAME; // kept for future S3 usage

if (!region) {
  throw new Error("AWS region is required. Set AWS_REGION or REGION.");
}
if (!collectionId) {
  throw new Error(
    "Rekognition collection id is required. Set REKOG_COLLECTION_ID (or AWS_REKOG_COLLECTION_ID / REKOGNITION_COLLECTION_ID)."
  );
}

const s3 = new S3Client({ region });
const rekog = new RekognitionClient({ region });
export const indexFace = async (imageBytes: Buffer, employeeId: string) => {
  try {
    // Ensure the collection exists (idempotent)
    try {
      await rekog.send(
        new DescribeCollectionCommand({ CollectionId: collectionId })
      );
    } catch (err: any) {
      // If collection doesn't exist, create it
      if (err.name === "ResourceNotFoundException") {
        await rekog.send(
          new CreateCollectionCommand({ CollectionId: collectionId })
        );
      } else {
        throw err;
      }
    }

    const params = {
      CollectionId: collectionId,
      Image: {
        Bytes: imageBytes,
      },
      ExternalImageId: employeeId,
      DetectionAttributes: [],
    };

    const command = new IndexFacesCommand(params);
    const response = await rekog.send(command);

    if (
      !response.FaceRecords ||
      response.FaceRecords.length === 0 ||
      !response.FaceRecords[0].Face ||
      !response.FaceRecords[0].Face.FaceId
    ) {
      return { success: false, message: "Face not indexed", faceId: null };
    }

    return {
      success: true,
      faceId: response.FaceRecords[0].Face.FaceId,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error indexing face",
      faceId: null,
      error,
    };
  }
};

export const addImageToS3 = async (imageBytes: Buffer, employeeId: string) => {
  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: employeeId,
      Body: imageBytes,
    });
    const response = await s3.send(command);
    return {
      success: true as const,
      message: "Image added to s3",
      key: employeeId,
    };
  } catch (error) {
    return {
      success: false as const,
      message: "Error indexing face",
      key: null,
      error,
    };
  }
};

export const searchfacebyimage = async (imageBytes: Buffer) => {
  try {
    const command = new SearchFacesByImageCommand({
      CollectionId: collectionId,
      Image: {
        Bytes: imageBytes,
      },
    });
    const response = await rekog.send(command);
    if (!response.FaceMatches || response.FaceMatches.length === 0) {
      return {
        success: false as const,
        message: "No face matches found",
        faceId: null,
        employeeId: null,
      };
    }
    const faceId = response.FaceMatches?.[0]?.Face?.FaceId || null;
    const employeeId = response.FaceMatches?.[0]?.Face?.ExternalImageId || null;
    return {
      success: true as const,
      message: "Face searched successfully",
      faceId: faceId,
      employeeId: employeeId,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error searching face",
      faceId: null as string | null,
      employeeId: null,
      error: error as any,
    };
  }
};
