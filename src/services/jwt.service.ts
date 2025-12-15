import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

interface Payload {
  userId: string;
  employeeId?: string;
  role?: string;
  isEmployee?: boolean;
  companyId?: string;
}

export const generateToken = (payload: Payload) => {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): Payload | null => {
  try {
    return jwt.verify(token, SECRET) as Payload;
  } catch (error) {
    return null;
  }
};

export const generateVerificationToken = (payload: Payload) => {
  return jwt.sign(payload, SECRET, { expiresIn: '24h' });
};