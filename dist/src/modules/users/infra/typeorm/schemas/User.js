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
const class_transformer_1 = require("class-transformer");
let User = class User {
    getLvl() {
        if (this.fullexp < 1000) {
            return 0;
        }
        if (this.fullexp < 2000) {
            return 1;
        }
        let base1 = 1000;
        let base2 = 2000;
        let levelCont = 1;
        while (true) {
            base1 += base2;
            levelCont += 1;
            if (this.fullexp < base1) {
                break;
            }
            base2 += base1;
            levelCont += 1;
            if (this.fullexp < base2) {
                break;
            }
        }
        return levelCont;
    }
    getExp() {
        if (this.fullexp < 1000) {
            return (this.fullexp / 1000) * 100;
        }
        if (this.fullexp < 2000) {
            return ((this.fullexp - 1000) / 1000) * 100;
        }
        if (this.fullexp < 3000) {
            return ((this.fullexp - 2000) / 1000) * 100;
        }
        let base1 = 2000;
        let base2 = 3000;
        let base3 = 5000;
        let aux = 0;
        while (true) {
            if (this.fullexp < base3) {
                return ((this.fullexp - base2) / base1) * 100;
            }
            base1 = base2 + 0;
            aux = base3 + 0;
            base3 = base2 + base3;
            base2 = aux + 0;
        }
    }
    getPermission() {
        switch (this.permission) {
            case 0:
                return 'admin';
            case 1:
                return 'moderator';
            default:
                return 'user';
        }
    }
};
__decorate([
    typeorm_1.ObjectIdColumn(),
    __metadata("design:type", typeorm_1.ObjectID)
], User.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    typeorm_1.Column(),
    class_transformer_1.Exclude(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], User.prototype, "description", void 0);
__decorate([
    typeorm_1.Column('int'),
    class_transformer_1.Exclude(),
    __metadata("design:type", Number)
], User.prototype, "fullexp", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], User.prototype, "avatar_url", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], User.prototype, "github", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], User.prototype, "linkedin", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], User.prototype, "permission", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], User.prototype, "created_at", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], User.prototype, "updated_at", void 0);
__decorate([
    class_transformer_1.Expose({ name: 'level' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Number)
], User.prototype, "getLvl", null);
__decorate([
    class_transformer_1.Expose({ name: 'exp_percent' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Number)
], User.prototype, "getExp", null);
__decorate([
    class_transformer_1.Expose({ name: 'access_level' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], User.prototype, "getPermission", null);
User = __decorate([
    typeorm_1.Entity('users')
], User);
exports.default = User;
