"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const company_route_1 = __importDefault(require("./routes/company.route"));
const department_route_1 = __importDefault(require("./routes/department.route"));
const shift_route_1 = __importDefault(require("./routes/shift.route"));
const employee_route_1 = __importDefault(require("./routes/employee.route"));
const attendance_route_1 = __importDefault(require("./routes/attendance.route"));
const health_route_1 = __importDefault(require("./routes/health.route"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
const port = process.env.PORT || 8000;
// Routes
app.use("/api/v1/health", health_route_1.default);
app.use("/api/v1/auth", auth_route_1.default);
app.use("/api/v1/company", company_route_1.default);
app.use("/api/v1/department", department_route_1.default);
app.use("/api/v1/shift", shift_route_1.default);
app.use("/api/v1/employee", employee_route_1.default);
app.use("/api/v1/attendance", attendance_route_1.default);
app.listen(port, () => {
    console.log(`Server is running on port ${port} in ${process.env.NODE_ENV} mode`);
});
exports.default = app;
