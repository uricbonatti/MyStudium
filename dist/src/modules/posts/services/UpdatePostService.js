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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const apollo_server_1 = require("apollo-server");
const remove_accents_1 = __importDefault(require("remove-accents"));
let UpdatePostService = class UpdatePostService {
    constructor(usersRepository, postsRepository, tagsRepository) {
        this.usersRepository = usersRepository;
        this.postsRepository = postsRepository;
        this.tagsRepository = tagsRepository;
    }
    async execute({ user_id, post_id, body, image_url, tag_ids, title, }) {
        const checkUserExists = await this.usersRepository.findById(user_id);
        if (!checkUserExists) {
            throw new apollo_server_1.ApolloError('User not found.', '400');
        }
        const post = await this.postsRepository.findByID(post_id);
        if (!post) {
            throw new apollo_server_1.ApolloError('Post not found.', '400');
        }
        if (!post.author.id.equals(checkUserExists.id)) {
            throw new apollo_server_1.ApolloError('User and Author not matched', '400');
        }
        if (title) {
            const slug = remove_accents_1.default(title).toLowerCase().replace(' ', '-');
            const checkSlugExist = await this.postsRepository.findBySlug(slug);
            const checkAuthorSlugExists = await checkSlugExist.filter(postFind => postFind.author.id.equals(post.author.id) &&
                !postFind.id.equals(post.id));
            if (checkAuthorSlugExists.length > 0) {
                throw new apollo_server_1.ApolloError('Author already have a Post with same title', '400');
            }
            post.title = title;
            post.slug = slug;
        }
        if (image_url)
            post.image_url = image_url;
        if (body)
            post.body = body;
        if (tag_ids) {
            const extractedTags = tag_ids.map(tag => tag.tag_id);
            const foundTags = [];
            // eslint-disable-next-line no-restricted-syntax
            for (const extractedTag of extractedTags) {
                // eslint-disable-next-line no-await-in-loop
                const tag = await this.tagsRepository.findById(extractedTag);
                if (tag) {
                    foundTags.push(tag);
                }
            }
            if (foundTags.length < tag_ids.length) {
                throw new apollo_server_1.ApolloError('Tag dont exist.', '400');
            }
            post.tags = [...foundTags];
        }
        const updatedPost = await this.postsRepository.save(post);
        return updatedPost;
    }
};
UpdatePostService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('UsersRepository')),
    __param(1, tsyringe_1.inject('PostsRepository')),
    __param(2, tsyringe_1.inject('TagsRepository')),
    __metadata("design:paramtypes", [Object, Object, Object])
], UpdatePostService);
exports.default = UpdatePostService;
