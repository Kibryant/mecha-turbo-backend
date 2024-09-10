import Controller, { IRequest, IResponse } from "../../../../../core/contracts/controller";
import { WebHookHotmart } from "../../../../../core/services/webhook-hotmart";
import { env } from "../../../../../lib/env";
import { HttpStatusCode } from "../../../../../types/http-status-code";
import { WebhookHotmartRequestDto } from "./webhook-hotmart-request-dto";
import { WebhookHotmartResponseDto } from "./webhook-hotmart-response-dto";

export class WebHookHotmartController implements Controller<WebhookHotmartRequestDto, WebhookHotmartResponseDto> {
    constructor(private readonly webhookHotmartService: WebHookHotmart) { }

    async handle(request: IRequest<WebhookHotmartRequestDto>, response: IResponse<WebhookHotmartResponseDto>): Promise<void> {
        const hotmartReceivedHottok = request.getRequest().headers['x-hotmart-hottok'];

        if (hotmartReceivedHottok !== env.HOTMART_HOTTOK) {
            return response.sendResponse(HttpStatusCode.UNAUTHORIZED, { message: 'Unauthorized', user: null, isFailure: true, isSuccess: false });
        }

        const user = request.getRequest().body.data.buyer;

        try {

            const purchaseDate = new Date();

            const expirationDate = new Date(
                new Date().setFullYear(new Date().getFullYear() + 1)
            )

            const result = await this.webhookHotmartService.execute({ email: user.email, name: user.name, password: user.checkout_phone, purchaseDate, expirationDate });

            if (result.isFailure) {
                return response.sendResponse(HttpStatusCode.BAD_REQUEST, { message: result.getErrorValue(), user: null, isFailure: true, isSuccess: false });
            }

            return response.sendResponse(HttpStatusCode.OK, { message: 'User created', user: result.value, isFailure: false, isSuccess: true });

        } catch (error) {
            if (error instanceof Error) {
                return response.sendResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, { message: error.message, user: null, isFailure: true, isSuccess: false });
            }

            return response.sendResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, { message: 'Internal server error', user: null, isFailure: true, isSuccess: false });
        }

    }
}