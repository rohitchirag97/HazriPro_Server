"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const shift_controller_1 = require("../controller/shift.controller");
const shiftRouter = (0, express_1.Router)();
shiftRouter.post("/create", auth_middleware_1.authenticate, shift_controller_1.createShift);
shiftRouter.get("/get-shifts", auth_middleware_1.authenticate, shift_controller_1.getShifts);
exports.default = shiftRouter;
