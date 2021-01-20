"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagsMutations = exports.TagsQuerys = void 0;
const TagsResolver_1 = require("./TagsResolver");
exports.TagsQuerys = {
    listTags: TagsResolver_1.listTags,
    getTag: TagsResolver_1.getTag
};
exports.TagsMutations = {
    createTag: TagsResolver_1.createTag
};
