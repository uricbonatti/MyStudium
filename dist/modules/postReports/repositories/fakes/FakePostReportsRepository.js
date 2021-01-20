"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const PostReport_1 = __importDefault(require("@modules/postReports/infra/typeorm/schemas/PostReport"));
class FakePostReportsRepository {
    constructor() {
        this.reports = [];
    }
    async create(data) {
        const report = new PostReport_1.default();
        Object.assign(report, { id: new mongodb_1.ObjectId(), closed: false }, data);
        this.reports.push(report);
        return report;
    }
    async close(report) {
        const findIndex = this.reports.findIndex((findReport) => findReport.id.equals(report.id));
        report.closed = true;
        this.reports[findIndex] = report;
        return report;
    }
    async findById(id) {
        const findReport = this.reports.find((report) => report.id.toHexString() === id);
        return findReport;
    }
    async findByUserId(id) {
        const findReports = this.reports.filter((report) => report.user_id.toHexString() === id);
        return findReports;
    }
    async findOpenReports() {
        const findReports = this.reports.filter((report) => !report.closed);
        return findReports;
    }
}
exports.default = FakePostReportsRepository;
