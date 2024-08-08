import { LoginAdminDto } from "../domain/dtos/login-admin-dto";
import { LoginAdminResponse } from "../domain/dtos/login-admin-response";
import { UpdateAdminDto } from "../domain/dtos/update-admin-dto";
import { UpdateAdminResponse } from "../domain/dtos/update-admin-response";
import { Admin } from "../domain/entities/admin";
import { Result } from "../shared/result";
import { HttpContext } from "./http-context";

interface HttpAdminController {
    login(ctx: HttpContext<LoginAdminDto, LoginAdminResponse>): Promise<Result<Admin>>;
    update(ctx: HttpContext<UpdateAdminDto, UpdateAdminResponse>): Promise<Result<Admin>>;
}

export { HttpAdminController }