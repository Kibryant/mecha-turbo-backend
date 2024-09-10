import { User } from "../../../../../core/domain/entities/user";

export interface WebhookHotmartResponseDto {
    message: string;
    user: User | null;
    isFailure: boolean;
    isSuccess: boolean;
}