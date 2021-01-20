"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const apollo_server_1 = require("apollo-server");
const apollo_1 = __importDefault(require("@config/apollo"));
const cors_1 = __importDefault(require("@config/cors"));
const schema_1 = __importDefault(require("./schema"));
const resolvers_1 = __importDefault(require("./resolvers"));
require("@shared/infra/typeorm");
require("@shared/container");
const server = new apollo_server_1.ApolloServer({
    typeDefs: schema_1.default,
    cors: cors_1.default,
    resolvers: resolvers_1.default,
    context: apollo_1.default.context,
    formatError: apollo_1.default.formatError
});
server.listen().then(({ url }) => {
    console.log(`Server running on ${url}`);
});
