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
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const mongodb_1 = require("mongodb");
const class_transformer_1 = require("class-transformer");
let Comment = class Comment {
    getLikes() {
        if (this.users_liked && this.users_liked.length > 0) {
            console.log(this.users_liked.length);
            return this.users_liked.length;
        }
        return 0;
    }
    solveBinaryBug() {
        this.post_id = new mongodb_1.ObjectId(this.post_id);
        this.users_liked = [];
    }
    solvBinaryBugAgain() {
        this.post_id = new mongodb_1.ObjectId(this.post_id);
    }
};
__decorate([
    typeorm_1.ObjectIdColumn(),
    __metadata("design:type", typeorm_1.ObjectID)
], Comment.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Comment.prototype, "body", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Object)
], Comment.prototype, "author", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", mongodb_1.ObjectId)
], Comment.prototype, "post_id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Array)
], Comment.prototype, "users_liked", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Comment.prototype, "created_at", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], Comment.prototype, "updated_at", void 0);
__decorate([
    class_transformer_1.Expose({ name: 'likes' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Number)
], Comment.prototype, "getLikes", null);
__decorate([
    typeorm_1.BeforeInsert(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Comment.prototype, "solveBinaryBug", null);
__decorate([
    typeorm_1.BeforeUpdate(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Comment.prototype, "solvBinaryBugAgain", null);
Comment = __decorate([
    typeorm_1.Entity('comments')
], Comment);
exports.default = Comment;
