import { HttpContext, HttpRequest } from "../../../core/contracts/http-context";
import { Request, Response } from 'express';
import { HttpStatusCode } from "../../../types/http-status-code";

class ExpressAdapter<T> implements HttpContext<T> {
    constructor(private request: Request, private response: Response) {}

    getRequest<T>(): HttpRequest<T> {
        return {
            body: this.request.body,
            params: this.request.params
        }
    }

    sendResponse<T>(status: HttpStatusCode, data: T | null): void {
        this.response.status(status).json(data);
    }
}

export { ExpressAdapter }