import { Result } from "../../shared/result";
import { CreateUserDto } from "../dtos/create-user-dto";
import { User } from "../entities/user";

interface UserRepository {
    create(user: User): Promise<Result<CreateUserDto>>;
    findByEmail(email: string): Promise<Result<User>>;
    findById(id: string): Promise<Result<User>>;
    findAll(): Promise<Result<User[]>>;
    update(user: User, id: string): Promise<Result<User>>;
    delete(id: string): Promise<Result<void>>;
}

export { UserRepository }