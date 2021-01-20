"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.showPostReport = exports.openPostReports = exports.userPostReports = exports.closePostReport = exports.createPostReport = void 0;
const tsyringe_1 = require("tsyringe");
const tokenValidation_1 = __importDefault(require("@shared/utils/tokenValidation"));
const CreatePostReportService_1 = __importDefault(require("@modules/postReports/services/CreatePostReportService"));
const ClosePostReportService_1 = __importDefault(require("@modules/postReports/services/ClosePostReportService"));
const ListUserPostReportsService_1 = __importDefault(require("@modules/postReports/services/ListUserPostReportsService"));
const ListOpenPostReportsService_1 = __importDefault(require("@modules/postReports/services/ListOpenPostReportsService"));
const ShowPostReportService_1 = __importDefault(require("@modules/postReports/services/ShowPostReportService"));
async function createPostReport(_, { data }, { token }) {
    const user_id = tokenValidation_1.default(token);
    const { post_id, body, title } = data;
    const createPostReportService = tsyringe_1.container.resolve(CreatePostReportService_1.default);
    const report = await createPostReportService.execute({
        body,
        post_id,
        title,
        user_id
    });
    return report;
}
exports.createPostReport = createPostReport;
async function closePostReport(_, { data }, { token }) {
    const user_id = tokenValidation_1.default(token);
    const { id, feedback, action } = data;
    const closePostReportService = tsyringe_1.container.resolve(ClosePostReportService_1.default);
    const report = await closePostReportService.execute({
        action,
        feedback,
        id,
        user_id
    });
    return report;
}
exports.closePostReport = closePostReport;
async function userPostReports(_, _, { token }) {
    const user_id = tokenValidation_1.default(token);
    const listUserPostReports = tsyringe_1.container.resolve(ListUserPostReportsService_1.default);
    const reports = await listUserPostReports.execute({ user_id });
    return reports;
}
exports.userPostReports = userPostReports;
async function openPostReports(_, _, { token }) {
    const user_id = tokenValidation_1.default(token);
    const listOpenPostReports = tsyringe_1.container.resolve(ListOpenPostReportsService_1.default);
    const reports = await listOpenPostReports.execute({ user_id });
    return reports;
}
exports.openPostReports = openPostReports;
async function showPostReport(_, { id }, { token }) {
    const user_id = tokenValidation_1.default(token);
    const showPostReportService = tsyringe_1.container.resolve(ShowPostReportService_1.default);
    const report = await showPostReportService.execute({ user_id, id });
    return report;
}
exports.showPostReport = showPostReport;
