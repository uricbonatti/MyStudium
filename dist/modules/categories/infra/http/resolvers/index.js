"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesMutations = exports.CategoriesQuerys = void 0;
const CategoriesResolver_1 = require("./CategoriesResolver");
exports.CategoriesQuerys = {
    listCategories: CategoriesResolver_1.listCategories
};
exports.CategoriesMutations = {
    createCategory: CategoriesResolver_1.createCategory
};
