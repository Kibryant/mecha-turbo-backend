import { HttpContext, HttpRequest } from "../../../core/contracts/http-context";
import { Request, Response } from 'express';
import { HttpStatusCode } from "../../../types/http-status-code";

class ExpressAdapter<Input, Output> implements HttpContext<Input, Output> {
    constructor(private request: Request, private response: Response) { }

    getRequest(): HttpRequest<Input> {
        return {
            body: this.request.body,
            params: this.request.params,
            headers: this.request.headers
        }
    }

    sendResponse(status: HttpStatusCode, data: Output): void {
        this.response.status(status).json(data);
    }
}

export { ExpressAdapter }