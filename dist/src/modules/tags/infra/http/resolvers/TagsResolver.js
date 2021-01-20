"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTag = exports.createTag = exports.listTags = void 0;
const tsyringe_1 = require("tsyringe");
const tokenValidation_1 = __importDefault(require("@shared/utils/tokenValidation"));
const CreateTagService_1 = __importDefault(require("@modules/tags/services/CreateTagService"));
const SearchTagsService_1 = __importDefault(require("@modules/tags/services/SearchTagsService"));
const ShowTagService_1 = __importDefault(require("@modules/tags/services/ShowTagService"));
async function listTags(_, { filter }) {
    const { category_id } = filter;
    const searchTagsService = tsyringe_1.container.resolve(SearchTagsService_1.default);
    const tags = await searchTagsService.execute({ category_id });
    return tags;
}
exports.listTags = listTags;
async function createTag(_, { data }, { token }) {
    const { category_id, name } = data;
    const user_id = tokenValidation_1.default(token);
    const createTagService = tsyringe_1.container.resolve(CreateTagService_1.default);
    const tag = await createTagService.execute({
        user_id,
        name,
        category_id,
    });
    return tag;
}
exports.createTag = createTag;
async function getTag(_, { id }) {
    const showTagService = tsyringe_1.container.resolve(ShowTagService_1.default);
    const tag = await showTagService.execute(id);
    return tag;
}
exports.getTag = getTag;
