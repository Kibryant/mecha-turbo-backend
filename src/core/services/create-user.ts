import { CreateUserDto } from "../domain/dtos/create-user-dto";
import { User } from "../domain/entities/user";
import { UserRepository } from "../domain/repository/user-repository";
import { Result } from "../shared/result";
import UseCase from "../shared/use-case";

class CreateUser implements UseCase<CreateUserDto, Result<User>> {
    constructor(private readonly userRepository: UserRepository) { }

    async execute(request: CreateUserDto): Promise<Result<User>> {
        const userAlreadyExists = await this.userRepository.findByEmail(request.email);

        if (userAlreadyExists.isSuccess) {
            return Result.fail<User>("User already exists");
        }

        const result = await this.userRepository.create(request);

        return result;
    }
}

export { CreateUser };