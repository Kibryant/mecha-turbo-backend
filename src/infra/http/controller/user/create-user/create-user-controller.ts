import Controller, { IRequest, IResponse } from "../../../../../core/contracts/controller";
import { CreateUserDto } from "../../../../../core/domain/dtos/create-user-dto";
import { User } from "../../../../../core/domain/entities/user";
import { CreateUser } from "../../../../../core/services/create-user";
import { HttpStatusCode } from "../../../../../types/http-status-code";
import { CreateUserResponseDto } from "./create-user-response-dto";

class CreateUserController implements Controller<CreateUserDto, CreateUserResponseDto> {
    constructor(private readonly createUser: CreateUser) { }

    async handle(request: IRequest<CreateUserDto>, response: IResponse<CreateUserResponseDto>): Promise<void> {
        const userToCreate = request.getRequest().body;

        try {
            const result = await this.createUser.execute(userToCreate);

            if (result.isFailure) {
                return response.sendResponse(HttpStatusCode.BAD_REQUEST, { message: result.getErrorValue(), user: null, isFailure: true, isSuccess: false });
            }

            return response.sendResponse(HttpStatusCode.CREATED, { message: 'User created', user: result.value, isFailure: false, isSuccess: true });

        } catch (error) {
            if (error instanceof Error) {
                return response.sendResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, { message: error.message, user: null, isFailure: true, isSuccess: false });
            }

            return response.sendResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, { message: 'Internal server error', user: null, isFailure: true, isSuccess: false });
        }
    }
}

export { CreateUserController };