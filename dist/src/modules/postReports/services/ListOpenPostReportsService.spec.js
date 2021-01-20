"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FakeUsersRepository_1 = __importDefault(require("@modules/users/repositories/fakes/FakeUsersRepository"));
const mongodb_1 = require("mongodb");
const apollo_server_1 = require("apollo-server");
const FakePostReportsRepository_1 = __importDefault(require("../repositories/fakes/FakePostReportsRepository"));
const ListOpenPostReportsService_1 = __importDefault(require("./ListOpenPostReportsService"));
let fakePostReportsRepository;
let fakeUsersRepository;
let listOpenPostReports;
let report;
let user;
describe('List Open Post Reports', () => {
    beforeEach(async () => {
        fakePostReportsRepository = new FakePostReportsRepository_1.default();
        fakeUsersRepository = new FakeUsersRepository_1.default();
        listOpenPostReports = new ListOpenPostReportsService_1.default(fakeUsersRepository, fakePostReportsRepository);
        user = await fakeUsersRepository.create({
            email: 'tes@tes.tes',
            name: 'John Duo',
            password: '123456',
        });
        report = await fakePostReportsRepository.create({
            post_id: new mongodb_1.ObjectId(),
            body: 'Teste 1',
            title: 'Teste 1',
            user_id: user.id,
        });
        const report2 = await fakePostReportsRepository.create({
            post_id: new mongodb_1.ObjectId(),
            body: 'Teste 2',
            title: 'Teste 2',
            user_id: user.id,
        });
        report2.closed = true;
    });
    it('should be able to list open post reports', async () => {
        user.permission = 1;
        const reports = await listOpenPostReports.execute({
            user_id: user.id.toHexString(),
        });
        expect(reports).toEqual([report]);
    });
    it('should not be able to list open post reports without permission', async () => {
        user.permission = 2;
        await expect(listOpenPostReports.execute({
            user_id: user.id.toHexString(),
        })).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
    it('should not be able to list open post reports with non-existing user', async () => {
        user.permission = 2;
        await expect(listOpenPostReports.execute({
            user_id: 'non-existing-user',
        })).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
});
