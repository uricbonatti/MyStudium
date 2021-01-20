"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
exports.default = {
    formatError: err => {
        var _a;
        if (err.message) {
            return new apollo_server_1.ApolloError(err.message, err.extensions.code === 'INTERNAL_SERVER_ERROR'
                ? '400'
                : (_a = err.extensions) === null || _a === void 0 ? void 0 : _a.code);
        }
        return new apollo_server_1.ApolloError('Internal Server Error', '500');
    },
    context: ({ req }) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return { token: '' };
        }
        const [, token] = authHeader.split(' ');
        return { token };
    },
};
