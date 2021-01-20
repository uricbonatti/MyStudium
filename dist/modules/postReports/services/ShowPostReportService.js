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
let ShowPostReportService = class ShowPostReportService {
    constructor(usersRepository, reportsRepository) {
        this.usersRepository = usersRepository;
        this.reportsRepository = reportsRepository;
    }
    async execute({ id, user_id }) {
        const user = await this.usersRepository.findById(user_id);
        if (!user) {
            throw new apollo_server_1.ApolloError('User not found', '400');
        }
        const report = await this.reportsRepository.findById(id);
        if (!report) {
            throw new apollo_server_1.ApolloError('Post Report not found', '400');
        }
        if (user.permission === 2 && !report.user_id.equals(user.id)) {
            throw new apollo_server_1.ApolloError('User dont have permission', '401');
        }
        return report;
    }
};
ShowPostReportService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('UsersRepository')),
    __param(1, tsyringe_1.inject('PostReportsRepository')),
    __metadata("design:paramtypes", [Object, Object])
], ShowPostReportService);
exports.default = ShowPostReportService;
