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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const remove_accents_1 = __importDefault(require("remove-accents"));
const apollo_server_1 = require("apollo-server");
const mongodb_1 = require("mongodb");
let CreatePostService = class CreatePostService {
    constructor(usersRepository, postsRepository, tagsRepository, categoriesRepository) {
        this.usersRepository = usersRepository;
        this.postsRepository = postsRepository;
        this.tagsRepository = tagsRepository;
        this.categoriesRepository = categoriesRepository;
    }
    async execute({ author_id, body, category_id, image_url, tag_ids, title, }) {
        var e_1, _a;
        const user = await this.usersRepository.findById(author_id);
        if (!user) {
            throw new apollo_server_1.ApolloError('Author/User not found.', '400');
        }
        const slug = remove_accents_1.default(title).toLowerCase().replace(' ', '-');
        const checkSlugExist = await this.postsRepository.findBySlug(slug);
        const checkAuthorSlugExists = await checkSlugExist.filter(postFind => postFind.author.id.equals(new mongodb_1.ObjectId(author_id)));
        if (checkAuthorSlugExists.length > 0) {
            throw new apollo_server_1.ApolloError('Author already have a Post with same title', '400');
        }
        if (!mongodb_1.ObjectId.isValid(category_id)) {
            throw new apollo_server_1.ApolloError('Category ID is invalid.', '400');
        }
        const category = await this.categoriesRepository.findById(category_id);
        if (!category) {
            throw new apollo_server_1.ApolloError('Category dont exist.', '400');
        }
        const extractedTagIds = tag_ids.map(tag => tag.tag_id);
        const stokedTags = [];
        try {
            // eslint-disable-next-line no-restricted-syntax
            for (var extractedTagIds_1 = __asyncValues(extractedTagIds), extractedTagIds_1_1; extractedTagIds_1_1 = await extractedTagIds_1.next(), !extractedTagIds_1_1.done;) {
                const tag_id = extractedTagIds_1_1.value;
                if (!mongodb_1.ObjectId.isValid(tag_id)) {
                    throw new apollo_server_1.ApolloError('Tag ID is invalid.', '400');
                }
                // eslint-disable-next-line no-await-in-loop
                const tag = await this.tagsRepository.findById(tag_id);
                if (!tag) {
                    throw new apollo_server_1.ApolloError('Tag dont exist.', '400');
                }
                stokedTags.push(tag);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (extractedTagIds_1_1 && !extractedTagIds_1_1.done && (_a = extractedTagIds_1.return)) await _a.call(extractedTagIds_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        const post = await this.postsRepository.create({
            author: user,
            body,
            slug,
            category,
            image_url,
            tags: stokedTags,
            title,
        });
        await this.postsRepository.save(post);
        return post;
    }
};
CreatePostService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('UsersRepository')),
    __param(1, tsyringe_1.inject('PostsRepository')),
    __param(2, tsyringe_1.inject('TagsRepository')),
    __param(3, tsyringe_1.inject('CategoriesRepository')),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], CreatePostService);
exports.default = CreatePostService;
