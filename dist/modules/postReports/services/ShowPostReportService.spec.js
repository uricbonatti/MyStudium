"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FakeUsersRepository_1 = __importDefault(require("@modules/users/repositories/fakes/FakeUsersRepository"));
const mongodb_1 = require("mongodb");
const apollo_server_1 = require("apollo-server");
const PostReport_1 = __importDefault(require("../infra/typeorm/schemas/PostReport"));
const FakePostReportsRepository_1 = __importDefault(require("../repositories/fakes/FakePostReportsRepository"));
const ShowPostReportService_1 = __importDefault(require("./ShowPostReportService"));
let fakeUsersRepository;
let fakePostReportsRepository;
let showPostReport;
let adm;
let user;
let report;
describe('Show Post Report', () => {
    beforeEach(async () => {
        fakePostReportsRepository = new FakePostReportsRepository_1.default();
        fakeUsersRepository = new FakeUsersRepository_1.default();
        showPostReport = new ShowPostReportService_1.default(fakeUsersRepository, fakePostReportsRepository);
        user = await fakeUsersRepository.create({
            email: 'tes@tes.tes',
            name: 'John Duo',
            password: '123456'
        });
        user.permission = 2;
        adm = await fakeUsersRepository.create({
            email: 'adm@tes.tes',
            name: 'John Duo Duo',
            password: '123456'
        });
        adm.permission = 0;
        report = await fakePostReportsRepository.create({
            post_id: new mongodb_1.ObjectId(),
            body: 'Teste 1',
            title: 'Teste 1',
            user_id: user.id
        });
    });
    it('should be able to show the report to user who created', async () => {
        await expect(showPostReport.execute({
            id: report.id.toHexString(),
            user_id: user.id.toHexString()
        })).resolves.toBeInstanceOf(PostReport_1.default);
    });
    it('should be able to show the report to user with high permission', async () => {
        await expect(showPostReport.execute({
            id: report.id.toHexString(),
            user_id: adm.id.toHexString()
        })).resolves.toBeInstanceOf(PostReport_1.default);
    });
    it('should not be able to show the report to user without permission', async () => {
        const lowerUser = await fakeUsersRepository.create({
            email: 'lu@tes.tes',
            name: 'John Duo',
            password: '123456'
        });
        lowerUser.permission = 2;
        await expect(showPostReport.execute({
            id: report.id.toHexString(),
            user_id: lowerUser.id.toHexString()
        })).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
    it('should not be able to show the report to non-existing user', async () => {
        await expect(showPostReport.execute({
            id: report.id.toHexString(),
            user_id: 'non-existing-user'
        })).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
    it('should not be able to show a non-existing report ', async () => {
        await expect(showPostReport.execute({
            id: 'non-existing-report',
            user_id: adm.id.toHexString()
        })).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
});
