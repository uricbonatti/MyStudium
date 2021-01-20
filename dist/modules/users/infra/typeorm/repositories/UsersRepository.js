"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const User_1 = __importDefault(require("../schemas/User"));
class UsersRepository {
    constructor() {
        this.odmRepository = typeorm_1.getMongoRepository(User_1.default);
    }
    async create({ name, email, description, password, linkedin, github }) {
        const user = this.odmRepository.create({
            name,
            email,
            password,
            description,
            linkedin,
            github,
            fullexp: 0,
            permission: 2
        });
        await this.odmRepository.save(user);
        return user;
    }
    async findById(id) {
        const findUser = await this.odmRepository.findOne(id);
        return findUser;
    }
    async findByEmail(email) {
        const findUser = await this.odmRepository.findOne({ where: { email } });
        return findUser;
    }
    async save(user) {
        return this.odmRepository.save(user);
    }
    async delete(id) {
        this.odmRepository.delete(id);
    }
}
exports.default = UsersRepository;
