"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const apollo_server_1 = require("apollo-server");
let UpdateProfileService = class UpdateProfileService {
    constructor(usersRepository, hashProvider) {
        this.usersRepository = usersRepository;
        this.hashProvider = hashProvider;
    }
    async execute({ id, email, name, description, old_password, password, github, linkedin, avatar_url }) {
        const user = await this.usersRepository.findById(id);
        if (!user) {
            throw new apollo_server_1.ApolloError('User not found.', '400');
        }
        const userWithUpdatedEmail = await this.usersRepository.findByEmail(email);
        if (userWithUpdatedEmail &&
            String(user.id) !== String(userWithUpdatedEmail.id)) {
            throw new apollo_server_1.ApolloError('Email already in use.', '400');
        }
        if (password && !old_password) {
            throw new apollo_server_1.ApolloError('You need to inform old password to set a new password', '400');
        }
        if (password && old_password) {
            const checkOldPassword = await this.hashProvider.compareHash(old_password, user.password);
            if (!checkOldPassword) {
                throw new apollo_server_1.ApolloError('Old Password not match', '400');
            }
            user.password = await this.hashProvider.generateHash(password);
        }
        user.name = name;
        user.email = email;
        if (description)
            user.description = description;
        if (avatar_url)
            user.avatar_url = avatar_url;
        if (linkedin)
            user.linkedin = linkedin;
        if (github)
            user.github = github;
        return this.usersRepository.save(user);
    }
};
UpdateProfileService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('UsersRepository')),
    __param(1, tsyringe_1.inject('HashProvider')),
    __metadata("design:paramtypes", [Object, Object])
], UpdateProfileService);
exports.default = UpdateProfileService;
