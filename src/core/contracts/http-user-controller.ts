import { DataWebhookHotmart } from "../../types/data-webhook-hotmart";
import { CreateUserDto } from "../domain/dtos/create-user-dto";
import { LoginUserDto } from "../domain/dtos/login-user-dto";
import { UpdateUserDto } from "../domain/dtos/update-user-dto";
import { User } from "../domain/entities/user";
import { Result } from "../shared/result";
import { HttpContext } from "./http-context";

interface HttpUserController {
    create(ctx: HttpContext<CreateUserDto, User>): Promise<Result<User>>;
    webhookHotmart(ctx: HttpContext<DataWebhookHotmart, User>): Promise<Result<User>>;
    login(ctx: HttpContext<LoginUserDto, User>): Promise<Result<User>>;
    findAll(ctx: HttpContext<null, User[]>): Promise<Result<User[]>>;
    findById(ctx: HttpContext<null, User>): Promise<Result<User>>;
    delete(ctx: HttpContext<null, null>): Promise<Result<void>>;
    update(ctx: HttpContext<UpdateUserDto, User>): Promise<Result<User>>;
}

export { HttpUserController }