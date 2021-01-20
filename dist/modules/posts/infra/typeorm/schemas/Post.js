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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const Category_1 = __importDefault(require("@modules/categories/infra/typeorm/schemas/Category"));
const class_transformer_1 = require("class-transformer");
let Post = class Post {
    getLikes() {
        if (this.users_liked && this.users_liked.length > 0) {
            console.log(this.users_liked.length);
            return this.users_liked.length;
        }
        return 0;
    }
};
__decorate([
    typeorm_1.ObjectIdColumn(),
    __metadata("design:type", typeorm_1.ObjectID)
], Post.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Post.prototype, "title", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Post.prototype, "image_url", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Post.prototype, "body", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Object)
], Post.prototype, "author", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Array)
], Post.prototype, "users_liked", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Category_1.default)
], Post.prototype, "category", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Array)
], Post.prototype, "tags", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Post.prototype, "slug", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Post.prototype, "created_at", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], Post.prototype, "updated_at", void 0);
__decorate([
    class_transformer_1.Expose({ name: 'likes' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Number)
], Post.prototype, "getLikes", null);
Post = __decorate([
    typeorm_1.Entity('posts')
], Post);
exports.default = Post;
