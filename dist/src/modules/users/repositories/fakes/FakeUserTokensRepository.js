"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const uuid_1 = require("uuid");
const UserToken_1 = __importDefault(require("@modules/users/infra/typeorm/schemas/UserToken"));
class FakeUserTokensRepository {
    constructor() {
        this.userTokens = [];
    }
    async generate(user_id) {
        const userToken = new UserToken_1.default();
        Object.assign(userToken, {
            id: new mongodb_1.ObjectID(),
            token: uuid_1.v4(),
            user_id: new mongodb_1.ObjectID(),
            created_at: new Date(),
            updated_at: new Date(),
        });
        this.userTokens.push(userToken);
        return userToken;
    }
    async findByToken(token) {
        const userToken = this.userTokens.find(findToken => findToken.token === token);
        return userToken;
    }
}
exports.default = FakeUserTokensRepository;
