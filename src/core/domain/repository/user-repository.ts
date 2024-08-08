import { Result } from "../../shared/result";
import { CreateUserDto } from "../dtos/create-user-dto";
import { UpdateUserDto } from "../dtos/update-user-dto";
import { User } from "../entities/user";

interface UserRepository {
    create(user: CreateUserDto): Promise<Result<User>>;
    findByEmail(email: string): Promise<Result<User>>;
    findById(id: string): Promise<Result<User>>;
    findAll(): Promise<Result<User[]>>;
    update(user: UpdateUserDto, id: string): Promise<Result<User>>;
    delete(id: string): Promise<Result<void>>;
}

export { UserRepository }