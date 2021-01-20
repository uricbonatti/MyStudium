"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const typeorm_1 = require("typeorm");
const PostReport_1 = __importDefault(require("../schemas/PostReport"));
class PostReportsRepository {
    constructor() {
        this.odmRepository = typeorm_1.getMongoRepository(PostReport_1.default);
    }
    async create({ body, post_id, title, user_id, }) {
        const report = this.odmRepository.create({
            body,
            post_id,
            title,
            user_id,
            closed: false,
        });
        await this.odmRepository.save(report);
        return report;
    }
    async close(report) {
        // eslint-disable-next-line no-param-reassign
        report.closed = true;
        return this.odmRepository.save(report);
    }
    async findById(id) {
        const report = await this.odmRepository.findOne(id);
        return report;
    }
    async findByUserId(id) {
        const user_id = new mongodb_1.ObjectId(id);
        const reports = await this.odmRepository.find({
            where: {
                user_id,
            },
        });
        return reports;
    }
    async findOpenReports() {
        const reports = await this.odmRepository.find({
            where: {
                closed: false,
            },
        });
        return reports;
    }
}
exports.default = PostReportsRepository;
