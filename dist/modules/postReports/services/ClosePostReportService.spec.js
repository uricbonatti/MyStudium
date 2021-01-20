"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FakeUsersRepository_1 = __importDefault(require("@modules/users/repositories/fakes/FakeUsersRepository"));
const mongodb_1 = require("mongodb");
const apollo_server_1 = require("apollo-server");
const FakePostReportsRepository_1 = __importDefault(require("../repositories/fakes/FakePostReportsRepository"));
const ClosePostReportService_1 = __importDefault(require("./ClosePostReportService"));
let fakePostReportsRepository;
let fakeUsersRepository;
let closePostReport;
let report;
let user;
describe('Close Post Report', () => {
    beforeEach(async () => {
        fakePostReportsRepository = new FakePostReportsRepository_1.default();
        fakeUsersRepository = new FakeUsersRepository_1.default();
        closePostReport = new ClosePostReportService_1.default(fakeUsersRepository, fakePostReportsRepository);
        user = await fakeUsersRepository.create({
            email: 'tes@tes.tes',
            name: 'John Duo',
            password: '123456'
        });
        user.permission = 2;
        report = await fakePostReportsRepository.create({
            body: 'Só por reportar',
            title: 'Teste',
            post_id: new mongodb_1.ObjectId(),
            user_id: new mongodb_1.ObjectId()
        });
    });
    it('should be able to close a report', async () => {
        user.permission = 1;
        const closedReport = await closePostReport.execute({
            action: 'nothing',
            feedback: 'só fechei',
            user_id: user.id.toHexString(),
            id: report.id.toHexString()
        });
        expect(closedReport.moderator_id).toEqual(user.id);
        expect(closedReport.closed).toEqual(true);
    });
    it('should not be able to close a report without permission', async () => {
        await expect(closePostReport.execute({
            action: 'nothing',
            feedback: 'só fechei',
            user_id: user.id.toHexString(),
            id: report.id.toHexString()
        })).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
    it('should not be able to close a non-existing report', async () => {
        user.permission = 1;
        await expect(closePostReport.execute({
            action: 'nothing',
            feedback: 'só fechei',
            user_id: user.id.toHexString(),
            id: 'non-existing'
        })).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
    it('should not be able to close a report with a non-existing user', async () => {
        await expect(closePostReport.execute({
            action: 'nothing',
            feedback: 'só fechei',
            user_id: 'non-existing',
            id: report.id.toHexString()
        })).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
});
