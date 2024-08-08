import { UpdateAdminDto } from "../../../core/domain/dtos/update-admin-dto";
import { Admin } from "../../../core/domain/entities/admin";
import { AdminRepository } from "../../../core/domain/repository/admin-repository";
import { Result } from "../../../core/shared/result";
import AdminModel from "../models/admin-model";

class MongoAdminRepository implements AdminRepository {
    adminModel: typeof AdminModel;

    constructor() {
        this.adminModel = AdminModel;
    }

    async findByEmail(email: string): Promise<Result<Admin>> {
        const admin = await this.adminModel.findOne<Admin>({
            email
        });

        if (!admin) {
            return Result.fail<Admin>("Admin not found");
        }

        return Result.ok<Admin>(admin);
    }

    async update(admin: UpdateAdminDto): Promise<Result<Admin>> {
        const { oldEmail, email, password, accessCode } = admin;

        const adminUpdated = await this.adminModel.findOneAndUpdate<Admin>(
            { email: oldEmail },
            {
                email,
                password,
                accessCode
            },
            { new: true }
        );

        if (!adminUpdated) {
            return Result.fail<Admin>("Admin not found");
        }


        return Result.ok<Admin>(adminUpdated);
    }
}

export { MongoAdminRepository };