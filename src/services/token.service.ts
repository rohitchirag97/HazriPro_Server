import redis from "../config/redis";

export const saveToken = async (phone: string, token: string) => {
  await redis.set(phone, token, { EX: 7 * 24 * 60 * 60 });
};

export const getToken = async (phone: string) => {
  return await redis.get(phone);
};

export const removeToken = async (phone: string) => {
  await redis.del(phone);
};

