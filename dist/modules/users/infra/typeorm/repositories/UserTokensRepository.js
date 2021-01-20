"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const UserToken_1 = __importDefault(require("../schemas/UserToken"));
class UserTokensRepository {
    constructor() {
        this.odmRepository = typeorm_1.getMongoRepository(UserToken_1.default);
    }
    async generate(user_id) {
        const userToken = this.odmRepository.create({ user_id });
        await this.odmRepository.save(userToken);
        return userToken;
    }
    async findByToken(token) {
        const userToken = await this.odmRepository.findOne({ where: { token } });
        return userToken;
    }
}
exports.default = UserTokensRepository;
