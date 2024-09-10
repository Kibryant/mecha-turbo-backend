import { User } from "../../../../../core/domain/entities/user";

interface CreateUserResponseDto {
    message: string;
    user: User | null;
    isFailure: boolean;
    isSuccess: boolean;
}

export { CreateUserResponseDto }