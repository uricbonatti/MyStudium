"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const User_1 = __importDefault(require("@modules/users/infra/typeorm/schemas/User"));
class FakeUsersRepository {
    constructor() {
        this.users = [];
    }
    async create(userData) {
        const user = new User_1.default();
        Object.assign(user, Object.assign({ id: new mongodb_1.ObjectId() }, userData));
        this.users.push(user);
        return user;
    }
    async findById(id) {
        const findUser = this.users.find((user) => user.id.toHexString() === id);
        return findUser;
    }
    async findByEmail(email) {
        const findUser = this.users.find((user) => user.email === email);
        return findUser;
    }
    async save(user) {
        const findIndex = this.users.findIndex((findUser) => findUser.id === user.id);
        this.users[findIndex] = user;
        return user;
    }
    async delete(id) {
        const findIndex = this.users.findIndex((findUser) => findUser.id === mongodb_1.ObjectId.createFromHexString(id));
        this.users = [...this.users.slice(findIndex, 1)];
    }
}
exports.default = FakeUsersRepository;
