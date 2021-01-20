"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FakeHashProvider {
    async generateHash(payload) {
        return payload;
    }
    async compareHash(payload, hashed) {
        return payload === hashed;
    }
}
exports.default = FakeHashProvider;
