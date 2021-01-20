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
const mongodb_1 = require("mongodb");
const apollo_server_1 = require("apollo-server");
let ShowCategoryService = class ShowCategoryService {
    constructor(categoriesRepository) {
        this.categoriesRepository = categoriesRepository;
    }
    async execute(category_id) {
        if (mongodb_1.ObjectId.isValid(category_id)) {
            const category = await this.categoriesRepository.findById(category_id);
            if (category) {
                return category;
            }
            throw new apollo_server_1.ApolloError('Category dont exist', '400');
        }
        throw new apollo_server_1.ApolloError('Category ID is not valid', '400');
    }
};
ShowCategoryService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('CategoriesRepository')),
    __metadata("design:paramtypes", [Object])
], ShowCategoryService);
exports.default = ShowCategoryService;
