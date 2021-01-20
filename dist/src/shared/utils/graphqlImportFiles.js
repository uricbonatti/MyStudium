"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadFiles = exports.loadFile = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const fast_glob_1 = __importDefault(require("fast-glob"));
const graphql_tools_1 = require("graphql-tools");
function loadFile(pathFile) {
    const fileString = fs_1.default.readFileSync(path_1.default.join(process.cwd(), pathFile), 'utf8');
    return fileString;
}
exports.loadFile = loadFile;
function loadFiles(pathFiles) {
    const files = fast_glob_1.default.sync(pathFiles);
    const schema = files.map(file => fs_1.default.readFileSync(path_1.default.join(process.cwd(), file), 'utf8'));
    return graphql_tools_1.mergeTypeDefs(schema);
}
exports.loadFiles = loadFiles;
exports.default = { loadFile, loadFiles };
