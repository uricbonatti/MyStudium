"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = require("bcryptjs");
class BCryptHashProvider {
    async generateHash(payload) {
        return bcryptjs_1.hash(payload, 8);
    }
    async compareHash(payload, hashed) {
        return bcryptjs_1.compare(payload, hashed);
    }
}
exports.default = BCryptHashProvider;
