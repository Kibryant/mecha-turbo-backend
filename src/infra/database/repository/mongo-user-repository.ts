import { CreateUserDto } from "../../../core/domain/dtos/create-user-dto";
import { UpdateUserDto } from "../../../core/domain/dtos/update-user-dto";
import { User } from "../../../core/domain/entities/user";
import { UserRepository } from "../../../core/domain/repository/user-repository";
import { Result } from "../../../core/shared/result";
import UserModel from "../models/user-model";

class MongoUserRepository implements UserRepository {
    userModel: typeof UserModel;

    constructor() {
        this.userModel = UserModel;
    }

    async create(user: CreateUserDto): Promise<Result<User>> {
        try {
            const newUser = new this.userModel({
                name: user.name,
                email: user.email,
                password: user.password,
                purchaseDate: user.purchaseDate,
                expirationDate: user.expirationDate
            });

            await newUser.save();

            return Result.ok<CreateUserDto>(newUser);
        } catch (error) {
            if (error instanceof Error) {
                return Result.fail<User>(error.message);
            }

            return Result.fail<User>("Erro interno.");

        };
    }
    async findByEmail(email: string): Promise<Result<User>> {
        try {
            const user = await this.userModel.findOne<User>({ email });

            if (!user) {
                return Result.fail<User>("Usuário não encontrado.");
            }

            return Result.ok<User>(user);
        } catch (error) {
            if (error instanceof Error) {
                return Result.fail<User>(error.message);
            }

            return Result.fail<User>("Erro interno.");
        }
    }
    async findById(id: string): Promise<Result<User>> {
        try {
            const user = await this.userModel.findById<User>(id);

            if (!user) {
                return Result.fail<User>("Usuário não encontrado.");
            }

            return Result.ok<User>(user);
        } catch (error) {
            if (error instanceof Error) {
                return Result.fail<User>(error.message);
            }

            return Result.fail<User>("Erro interno.");
        }

    }
    async findAll(): Promise<Result<User[]>> {
        try {
            const users = await this.userModel.find<User>();
            return Result.ok<User[]>(users);
        } catch (error) {
            if (error instanceof Error) {
                return Result.fail<User[]>(error.message);
            }

            return Result.fail<User[]>("Erro interno.");
        }
    }
    async update(user: UpdateUserDto, id: string): Promise<Result<User>> {
        try {
            const updatedUser = await this.userModel.findByIdAndUpdate<User>(id, user, { new: true });

            if (!updatedUser) {
                return Result.fail<User>("Usuário não encontrado.");
            }

            return Result.ok<User>(updatedUser);

        } catch (error) {

            if (error instanceof Error) {
                return Result.fail<User>(error.message);
            }

            return Result.fail<User>("Erro interno.");

        }
    }
    async delete(id: string): Promise<Result<void>> {
        try {
            const user = await this.userModel.findByIdAndDelete(id);

            if (!user) {
                return Result.fail<void>("Usuário não encontrado.");
            }

            return Result.ok<void>();
        } catch (error) {
            if (error instanceof Error) {
                return Result.fail<void>(error.message);
            }

            return Result.fail<void>("Erro interno.");
        }
    }
}

export { MongoUserRepository }