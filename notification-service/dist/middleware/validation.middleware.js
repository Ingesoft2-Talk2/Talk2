"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const error_middleware_1 = require("./error.middleware");
const validateRequest = (schema) => {
    return (req, _res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            const message = error.errors?.map((e) => e.message).join(', ') || 'Validation failed';
            throw new error_middleware_1.AppError(400, message);
        }
    };
};
exports.validateRequest = validateRequest;
//# sourceMappingURL=validation.middleware.js.map