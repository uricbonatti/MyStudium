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
let CreateTagService = class CreateTagService {
    constructor(usersRepository, tagsRepository, categoriesRepository) {
        this.usersRepository = usersRepository;
        this.tagsRepository = tagsRepository;
        this.categoriesRepository = categoriesRepository;
    }
    async execute({ name, category_id, user_id, }) {
        const user = await this.usersRepository.findById(user_id);
        if (!user) {
            throw new apollo_server_1.ApolloError('User not found', '400');
        }
        const category = await this.categoriesRepository.findById(category_id);
        if (!category) {
            throw new apollo_server_1.ApolloError('Category not found', '400');
        }
        const checkTagExist = await this.tagsRepository.findByName(name);
        if (checkTagExist) {
            throw new apollo_server_1.ApolloError('This Tag already exist');
        }
        const tag = await this.tagsRepository.create({
            category,
            name,
        });
        return tag;
    }
};
CreateTagService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('UsersRepository')),
    __param(1, tsyringe_1.inject('TagsRepository')),
    __param(2, tsyringe_1.inject('CategoriesRepository')),
    __metadata("design:paramtypes", [Object, Object, Object])
], CreateTagService);
exports.default = CreateTagService;
