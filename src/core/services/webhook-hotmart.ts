import { CreateUserDto } from "../domain/dtos/create-user-dto";
import { User } from "../domain/entities/user";
import { UserRepository } from "../domain/repository/user-repository";
import { Result } from "../shared/result";
import UseCase from "../shared/use-case";

class WebHookHotmart implements UseCase<CreateUserDto, Result<User>> {
    constructor(private readonly userRepository: UserRepository) { }

    async execute(request: CreateUserDto): Promise<Result<User>> {
        try {
            const userAlreadyExists = await this.userRepository.findByEmail(request.email);

            if (userAlreadyExists.isSuccess) {
                return Result.fail<User>("Usuário já existe.");
            }

            const result = await this.userRepository.create(request);

            return result;

        } catch (error) {
            if (error instanceof Error) {
                return Result.fail<User>(error.message);
            }

            return Result.fail<User>("Erro interno.");
        }
    }
}

export { WebHookHotmart };