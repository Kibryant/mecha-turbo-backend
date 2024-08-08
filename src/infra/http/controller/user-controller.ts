import { HttpContext } from "../../../core/contracts/http-context";
import { HttpUserController } from "../../../core/contracts/http-user-controller";
import { CreateUserDto } from "../../../core/domain/dtos/create-user-dto";
import { User } from "../../../core/domain/entities/user";
import { UserRepository } from "../../../core/domain/repository/user-repository";
import { Result } from "../../../core/shared/result";

class UserController implements HttpUserController {
  constructor(private readonly userRepository: UserRepository) {}

    async create(ctx: HttpContext<CreateUserDto>): Promise<Result<User>> {
        try {
            const { name, email, password, purchaseDate, expirationDate } = ctx.getRequest().body;

            const userOrError = await this.userRepository.create({
                name,
                email,
                password,
                purchaseDate,
                expirationDate
            })

            if(userOrError.isFailure) {
                return Result.fail<User>(userOrError.getErrorValue())
            }

            return Result.ok<User>(userOrError.value)

        } catch (error) {
            if (error instanceof Error) {
                return Result.fail<User>(error.message)
            }

            return Result.fail<User>('An error has occurred')
        }
    }

    async findAll(): Promise<Result<User[]>> {
        try {
            const usersOrError = await this.userRepository.findAll()
    
            if(usersOrError.isFailure) {
                return Result.fail<User[]>(usersOrError.getErrorValue())
            }
    
            return Result.ok<User[]>(usersOrError.value)
    
        } catch (error) {
            if (error instanceof Error) {
                return Result.fail<User[]>(error.message)
            }
    
            return Result.fail<User[]>('An error has occurred')
        }
    }

    async findById(ctx: HttpContext<null>): Promise<Result<User>> {
        try {
            const { id } = ctx.getRequest().params;

            if (!id) {
                return Result.fail<User>('Id is required')
            }

            const userOrError = await this.userRepository.findById(id)
    
            if(userOrError.isFailure) {
                return Result.fail<User>(userOrError.getErrorValue())
            }
    
            return Result.ok<User>(userOrError.value)
    
        } catch (error) {
            if (error instanceof Error) {
                return Result.fail<User>(error.message)
            }
    
            return Result.fail<User>('An error has occurred')
        }
    }

    async findByEmail(ctx: HttpContext<null>): Promise<Result<User>> {
        try {
            const { email } = ctx.getRequest().params;

            if (!email) {
                return Result.fail<User>('Email is required')
            }

            const userOrError = await this.userRepository.findByEmail(email)
    
            if(userOrError.isFailure) {
                return Result.fail<User>(userOrError.getErrorValue())
            }
    
            return Result.ok<User>(userOrError.value)
    
        } catch (error) {
            if (error instanceof Error) {
                return Result.fail<User>(error.message)
            }
    
            return Result.fail<User>('An error has occurred')
        }
    }

    async delete(ctx: HttpContext<null>): Promise<Result<void>> {
        try {
            const { id } = ctx.getRequest().params;

            if (!id) {
                return Result.fail<void>('Id is required')
            }

            const userOrError = await this.userRepository.delete(id)
    
            if(userOrError.isFailure) {
                return Result.fail<void>(userOrError.getErrorValue())
            }
    
            return Result.ok<void>()
    
        } catch (error) {
            if (error instanceof Error) {
                return Result.fail<void>(error.message)
            }
    
            return Result.fail<void>('An error has occurred')
        }
    }

    async update(ctx: HttpContext<CreateUserDto>): Promise<Result<User>> {
        try {
            const { id } = ctx.getRequest().params;
            const { name, email, password, purchaseDate, expirationDate } = ctx.getRequest().body;

            if (!id) {
                return Result.fail<User>('Id is required')
            }

            const userOrError = await this.userRepository.update({
                name,
                email,
                password,
                purchaseDate,
                expirationDate
            }, id)
    
            if(userOrError.isFailure) {
                return Result.fail<User>(userOrError.getErrorValue())
            }
    
            return Result.ok<User>(userOrError.value)
    
        } catch (error) {
            if (error instanceof Error) {
                return Result.fail<User>(error.message)
            }
    
            return Result.fail<User>('An error has occurred')
        }
    }

}

export { UserController };