"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeToken = exports.getToken = exports.saveToken = void 0;
const redis_1 = __importDefault(require("../config/redis"));
const saveToken = async (phone, token) => {
    await redis_1.default.set(phone, token, { EX: 7 * 24 * 60 * 60 });
};
exports.saveToken = saveToken;
const getToken = async (phone) => {
    return await redis_1.default.get(phone);
};
exports.getToken = getToken;
const removeToken = async (phone) => {
    await redis_1.default.del(phone);
};
exports.removeToken = removeToken;
