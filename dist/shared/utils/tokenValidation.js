"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const auth_1 = __importDefault(require("@config/auth"));
const apollo_server_1 = require("apollo-server");
function verifyToken(token) {
    try {
        const decoded = jsonwebtoken_1.verify(token, auth_1.default.jwt.secret);
        const { sub } = decoded;
        return sub;
    }
    catch (err) {
        throw new apollo_server_1.ApolloError('Invalid JWT token.', '401');
    }
}
exports.default = verifyToken;
