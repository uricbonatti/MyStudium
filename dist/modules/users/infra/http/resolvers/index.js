"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMutation = exports.UserQuery = void 0;
const UsersResolver_1 = require("./UsersResolver");
const SessionResolver_1 = require("./SessionResolver");
exports.UserQuery = {
    getUser: UsersResolver_1.getUser,
    login: SessionResolver_1.login,
    userSummary: UsersResolver_1.userSummary
};
exports.UserMutation = { createUser: UsersResolver_1.createUser, deleteUser: UsersResolver_1.deleteUser, updateUser: UsersResolver_1.updateUser };
