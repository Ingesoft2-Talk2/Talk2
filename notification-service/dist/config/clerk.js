"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clerkClient = void 0;
const clerk_sdk_node_1 = require("@clerk/clerk-sdk-node");
if (!process.env.CLERK_SECRET_KEY) {
    throw new Error('CLERK_SECRET_KEY is not defined in environment variables');
}
exports.clerkClient = (0, clerk_sdk_node_1.Clerk)({ secretKey: process.env.CLERK_SECRET_KEY });
//# sourceMappingURL=clerk.js.map