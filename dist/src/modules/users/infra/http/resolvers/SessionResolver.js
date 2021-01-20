"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const class_transformer_1 = require("class-transformer");
const tsyringe_1 = require("tsyringe");
const AuthenticateUserService_1 = __importDefault(require("@modules/users/services/AuthenticateUserService"));
// eslint-disable-next-line import/prefer-default-export
async function login(_, { data }) {
    const { email, password } = data;
    const authenticateUserService = tsyringe_1.container.resolve(AuthenticateUserService_1.default);
    const { user, token } = await authenticateUserService.execute({
        email,
        password,
    });
    return { user: class_transformer_1.classToClass(user), token };
}
exports.login = login;
