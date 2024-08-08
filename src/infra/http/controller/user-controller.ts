import { HashService } from "../../../core/contracts/hash-service";
import { HttpContext } from "../../../core/contracts/http-context";
import { HttpUserController } from "../../../core/contracts/http-user-controller";
import { CreateUserDto } from "../../../core/domain/dtos/create-user-dto";
import { LoginUserDto } from "../../../core/domain/dtos/login-user-dto";
import { UpdateUserDto } from "../../../core/domain/dtos/update-user-dto";
import { User } from "../../../core/domain/entities/user";
import { UserRepository } from "../../../core/domain/repository/user-repository";
import { Result } from "../../../core/shared/result";
import { env } from "../../../lib/env";
import { DataWebhookHotmart } from "../../../types/data-webhook-hotmart";
import { HttpStatusCode } from "../../../types/http-status-code";

class UserController implements HttpUserController {
    constructor(private readonly userRepository: UserRepository, private readonly hashService: HashService) { }

    async create(ctx: HttpContext<CreateUserDto, User>): Promise<Result<User>> {
        try {
            const { name, email, password, purchaseDate, expirationDate } = ctx.getRequest().body;

            const hashedPassword = await this.hashService.hash(password)

            const userOrError = await this.userRepository.create({
                name,
                email,
                password: hashedPassword,
                purchaseDate,
                expirationDate
            })

            if (userOrError.isFailure) {
                ctx.sendResponse(HttpStatusCode.BAD_REQUEST, userOrError.getErrorValue())
                return Result.fail<User>(userOrError.getErrorValue())
            }

            ctx.sendResponse(HttpStatusCode.CREATED, userOrError.value)
            return Result.ok<User>(userOrError.value)

        } catch (error) {
            if (error instanceof Error) {
                ctx.sendResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, error.message)
                return Result.fail<User>(error.message)
            }

            ctx.sendResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, 'An error has occurred')
            return Result.fail<User>('An error has occurred')
        }
    }

    async webhookHotmart(ctx: HttpContext<DataWebhookHotmart, User>): Promise<Result<User>> {
        try {
            const hotmartReceivedHottok = ctx.getRequest().headers?.['x-hotmart-hottok'];

            if (hotmartReceivedHottok !== env.HOTMART_HOTTOK) {
                ctx.sendResponse(HttpStatusCode.UNAUTHORIZED, 'Invalid hottok')
                return Result.fail<User>('Invalid hottok')
            }

            const { data } = ctx.getRequest().body;

            const { buyer } = data;

            const { name, email, checkout_phone } = buyer;

            const purchaseDate = new Date()

            const expirationDate = new Date(
                new Date().setFullYear(new Date().getFullYear() + 1)
            )

            const hashedPassword = await this.hashService.hash(checkout_phone)

            const userOrError = await this.userRepository.create({
                name,
                email,
                password: hashedPassword,
                purchaseDate,
                expirationDate
            })

            if (userOrError.isFailure) {
                ctx.sendResponse(HttpStatusCode.BAD_REQUEST, userOrError.getErrorValue())
                return Result.fail<User>(userOrError.getErrorValue())
            }

            ctx.sendResponse(HttpStatusCode.CREATED, userOrError.value)
            return Result.ok<User>(userOrError.value)

        } catch (error) {
            if (error instanceof Error) {
                ctx.sendResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, error.message)
                return Result.fail<User>(error.message)
            }

            ctx.sendResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, 'An error has occurred')
            return Result.fail<User>('An error has occurred')
        }
    }

    async login(ctx: HttpContext<LoginUserDto, User>): Promise<Result<User>> {
        try {
            const { email, password } = ctx.getRequest().body;

            const userOrError = await this.userRepository.findByEmail(email)

            if (userOrError.isFailure) {
                ctx.sendResponse(HttpStatusCode.BAD_REQUEST, userOrError.getErrorValue())
                return Result.fail<User>(userOrError.getErrorValue())
            }

            const user = userOrError.value

            const isPasswordValid = await this.hashService.compare(password, user.password)

            if (!isPasswordValid) {
                ctx.sendResponse(HttpStatusCode.BAD_REQUEST, 'Invalid password')
                return Result.fail<User>('Invalid password')
            }

            ctx.sendResponse(HttpStatusCode.OK, user)
            return Result.ok<User>(user)

        } catch (error) {
            if (error instanceof Error) {
                ctx.sendResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, error.message)
                return Result.fail<User>(error.message)
            }

            ctx.sendResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, 'An error has occurred')
            return Result.fail<User>('An error has occurred')
        }
    }

    async findAll(ctx: HttpContext<null, User[]>): Promise<Result<User[]>> {
        try {
            const usersOrError = await this.userRepository.findAll()

            if (usersOrError.isFailure) {
                ctx.sendResponse(HttpStatusCode.BAD_REQUEST, usersOrError.getErrorValue())
                return Result.fail<User[]>(usersOrError.getErrorValue())
            }

            ctx.sendResponse(HttpStatusCode.OK, usersOrError.value)

            return Result.ok<User[]>(usersOrError.value)

        } catch (error) {
            if (error instanceof Error) {
                ctx.sendResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, error.message)
                return Result.fail<User[]>(error.message)
            }

            ctx.sendResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, 'An error has occurred')
            return Result.fail<User[]>('An error has occurred')
        }
    }

    async findById(ctx: HttpContext<null, User>): Promise<Result<User>> {
        try {
            const { id } = ctx.getRequest().params;

            if (!id) {
                ctx.sendResponse(HttpStatusCode.BAD_REQUEST, 'Id is required')
                return Result.fail<User>('Id is required')
            }

            const userOrError = await this.userRepository.findById(id)

            if (userOrError.isFailure) {
                ctx.sendResponse(HttpStatusCode.BAD_REQUEST, userOrError.getErrorValue())
                return Result.fail<User>(userOrError.getErrorValue())
            }

            ctx.sendResponse(HttpStatusCode.OK, userOrError.value)
            return Result.ok<User>(userOrError.value)

        } catch (error) {
            if (error instanceof Error) {
                ctx.sendResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, error.message)
                return Result.fail<User>(error.message)
            }

            ctx.sendResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, 'An error has occurred')
            return Result.fail<User>('An error has occurred')
        }
    }

    async delete(ctx: HttpContext<null, null>): Promise<Result<void>> {
        try {
            const { id } = ctx.getRequest().params;

            if (!id) {
                ctx.sendResponse(HttpStatusCode.BAD_REQUEST, 'Id is required')
                return Result.fail<void>('Id is required')
            }

            const userOrError = await this.userRepository.delete(id)

            if (userOrError.isFailure) {
                ctx.sendResponse(HttpStatusCode.BAD_REQUEST, userOrError.getErrorValue())
                return Result.fail<void>(userOrError.getErrorValue())
            }

            ctx.sendResponse(HttpStatusCode.NO_CONTENT, null)
            return Result.ok<void>()

        } catch (error) {
            if (error instanceof Error) {
                return Result.fail<void>(error.message)
            }

            return Result.fail<void>('An error has occurred')
        }
    }

    async update(ctx: HttpContext<UpdateUserDto, User>): Promise<Result<User>> {
        try {
            const { id } = ctx.getRequest().params;
            const { name, email } = ctx.getRequest().body;

            if (!id) {
                ctx.sendResponse(HttpStatusCode.BAD_REQUEST, 'Id is required')
                return Result.fail<User>('Id is required')
            }

            const userOrError = await this.userRepository.update({
                name,
                email,
            }, id)

            if (userOrError.isFailure) {
                ctx.sendResponse(HttpStatusCode.BAD_REQUEST, userOrError.getErrorValue())
                return Result.fail<User>(userOrError.getErrorValue())
            }

            ctx.sendResponse(HttpStatusCode.OK, userOrError.value)
            return Result.ok<User>(userOrError.value)

        } catch (error) {
            if (error instanceof Error) {
                ctx.sendResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, error.message)
                return Result.fail<User>(error.message)
            }

            ctx.sendResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, 'An error has occurred')
            return Result.fail<User>('An error has occurred')
        }
    }

}

export { UserController };