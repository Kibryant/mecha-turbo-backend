import { HashService } from "../../../core/contracts/hash-service";
import { HttpAdminController } from "../../../core/contracts/http-admin-controller";
import { HttpContext } from "../../../core/contracts/http-context";
import { JwtService } from "../../../core/contracts/jwt-service";
import { LoginAdminDto } from "../../../core/domain/dtos/login-admin-dto";
import { LoginAdminResponse } from "../../../core/domain/dtos/login-admin-response";
import { UpdateAdminDto } from "../../../core/domain/dtos/update-admin-dto";
import { UpdateAdminResponse } from "../../../core/domain/dtos/update-admin-response";
import { Admin } from "../../../core/domain/entities/admin";
import { AdminRepository } from "../../../core/domain/repository/admin-repository";
import { Result } from "../../../core/shared/result";
import { env } from "../../../lib/env";
import { HttpStatusCode } from "../../../types/http-status-code";


class AdminController implements HttpAdminController {
    constructor(private readonly adminRepository: AdminRepository, private readonly hashService: HashService, private readonly jwtService: JwtService) { }

    async login(ctx: HttpContext<LoginAdminDto, LoginAdminResponse>): Promise<Result<Admin>> {
        const { email, password, accessCode } = ctx.getRequest().body;

        try {
            const result = await this.adminRepository.findByEmail(email);

            if (result.isFailure) {
                ctx.sendResponse(HttpStatusCode.UNAUTHORIZED, { message: "Invalid credentials" });
                return Result.fail<Admin>("Invalid credentials");
            }

            const admin = result.value;

            const isValidPassword = await this.hashService.compare(password, admin.password);

            if (!isValidPassword) {
                ctx.sendResponse(HttpStatusCode.UNAUTHORIZED, { message: "Invalid credentials" });
                return Result.fail<Admin>("Invalid credentials");
            }

            const isValidAccessCode = await this.hashService.compare(accessCode, admin.accessCode);

            if (!isValidAccessCode) {
                ctx.sendResponse(HttpStatusCode.UNAUTHORIZED, { message: "Invalid credentials" });
                return Result.fail<Admin>("Invalid credentials");
            }

            const token = this.jwtService.sign({ email }, env.JWT_SECRET_KEY);

            ctx.sendResponse(HttpStatusCode.OK, { token, message: "Admin logged in successfully" });

            return Result.ok<Admin>(admin);

        } catch (error) {
            if (error instanceof Error) {
                ctx.sendResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, { message: error.message });
                return Result.fail<Admin>(error.message);
            }

            ctx.sendResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, { message: "Internal error" });
            return Result.fail<Admin>("Internal error");
        }

    }

    async update(ctx: HttpContext<UpdateAdminDto, UpdateAdminResponse>): Promise<Result<Admin>> {
        const { oldEmail, email, password, accessCode } = ctx.getRequest().body;

        try {
            const result = await this.adminRepository.findByEmail(oldEmail);

            if (result.isFailure) {
                ctx.sendResponse(HttpStatusCode.NOT_FOUND, { message: "Admin not found", updated: false });
                return Result.fail<Admin>("Admin not found");
            }

            const admin = result.value;

            const hashedPassword = password ? await this.hashService.hash(password) : admin.password;
            const hashedAccessCode = accessCode ? await this.hashService.hash(accessCode) : admin.accessCode;

            const updatedAdmin = { oldEmail, email, password: hashedPassword, accessCode: hashedAccessCode }

            const updatedAdminOrError = await this.adminRepository.update(updatedAdmin);

            if (updatedAdminOrError.isFailure) {
                ctx.sendResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, { message: "Internal error", updated: false });
                return Result.fail<Admin>("Internal error");
            }

            ctx.sendResponse(HttpStatusCode.OK, { message: "Admin updated successfully", updated: true });

            return Result.ok<Admin>(updatedAdminOrError.value);

        } catch (error) {
            if (error instanceof Error) {
                ctx.sendResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, { message: error.message, updated: false });
                return Result.fail<Admin>(error.message);
            }

            ctx.sendResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, { message: "Internal error", updated: false });
            return Result.fail<Admin>("Internal error");
        }
    }

}

export { AdminController }