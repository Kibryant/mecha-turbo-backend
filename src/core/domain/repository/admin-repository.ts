import { Admin } from "../entities/admin";
import { Result } from "../../shared/result";
import { UpdateAdminDto } from "../dtos/update-admin-dto";

interface AdminRepository {
    findByEmail(email: string): Promise<Result<Admin>>;
    update(admin: UpdateAdminDto): Promise<Result<Admin>>;
}

export { AdminRepository }