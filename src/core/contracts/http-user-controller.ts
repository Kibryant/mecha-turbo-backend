import { CreateUserDto } from "../domain/dtos/create-user-dto";
import { User } from "../domain/entities/user";
import { Result } from "../shared/result";
import { HttpContext } from "./http-context";

interface HttpUserController {
    create(ctx: HttpContext<CreateUserDto>): Promise<Result<User>>;
    findAll(): Promise<Result<User[]>>;
    findById(ctx: HttpContext<null>): Promise<Result<User>>;
    findByEmail(ctx: HttpContext<null>): Promise<Result<User>>;
    delete(ctx: HttpContext<null>): Promise<Result<void>>;
    update(ctx: HttpContext<CreateUserDto>): Promise<Result<User>>;
}

export { HttpUserController }