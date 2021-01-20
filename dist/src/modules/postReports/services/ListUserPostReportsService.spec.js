"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FakeUsersRepository_1 = __importDefault(require("@modules/users/repositories/fakes/FakeUsersRepository"));
const mongodb_1 = require("mongodb");
const apollo_server_1 = require("apollo-server");
const FakePostReportsRepository_1 = __importDefault(require("../repositories/fakes/FakePostReportsRepository"));
const ListUserPostReportsService_1 = __importDefault(require("./ListUserPostReportsService"));
let fakeUsersRepository;
let fakePostReportRepository;
let listUserPostReport;
let user;
let report1;
let report2;
describe('List User Post Reports', () => {
    beforeEach(async () => {
        fakePostReportRepository = new FakePostReportsRepository_1.default();
        fakeUsersRepository = new FakeUsersRepository_1.default();
        listUserPostReport = new ListUserPostReportsService_1.default(fakeUsersRepository, fakePostReportRepository);
        user = await fakeUsersRepository.create({
            email: 'tes@tes.tes',
            name: 'John Duo',
            password: '123456',
        });
        report1 = await fakePostReportRepository.create({
            post_id: new mongodb_1.ObjectId(),
            body: 'Teste 1',
            title: 'Teste 1',
            user_id: user.id,
        });
        report2 = await fakePostReportRepository.create({
            post_id: new mongodb_1.ObjectId(),
            body: 'Teste 2',
            title: 'Teste 2',
            user_id: user.id,
        });
        await fakePostReportRepository.create({
            post_id: new mongodb_1.ObjectId(),
            body: 'Teste 3',
            title: 'Teste 3',
            user_id: new mongodb_1.ObjectId(),
        });
    });
    it('should be able to list user post reports', async () => {
        const reports = await listUserPostReport.execute({
            user_id: user.id.toHexString(),
        });
        expect(reports).toEqual([report1, report2]);
    });
    it('should not be able to list post reports to a non-existing user', async () => {
        await expect(listUserPostReport.execute({
            user_id: 'non-existing',
        })).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
});
