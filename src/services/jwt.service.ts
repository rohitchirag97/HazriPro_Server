import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

interface Payload {
  userId: string;
}

export const generateRefreshToken = (payload: Payload) => {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
};
export const generateAccessToken = (payload: Payload) => {
  return jwt.sign(payload, SECRET, { expiresIn: '1h' });
};

export const verifyToken = (token: string): Payload | null => {
  try {
    return jwt.verify(token, SECRET) as Payload;
  } catch (error) {
    return null;
  }
};