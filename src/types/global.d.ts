declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
    }
  }
  
  namespace Express {
    interface Request {
      user?: any;
      file?: Express.Multer.File;
    }
  }
}

export {};
