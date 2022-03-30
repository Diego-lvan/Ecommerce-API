"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
const pool = promise_1.default.createPool({
    host: process.env.dbHost,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PWD,
});
exports.default = pool;
