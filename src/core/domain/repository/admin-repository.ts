import { Admin } from "../entities/admin";
import { Result } from "../../shared/result";

interface AdminRepository {
    findByEmail(email: string): Promise<Result<Admin | null>>;
    update(admin: Admin): Promise<Result<Admin>>;
}

export { AdminRepository }