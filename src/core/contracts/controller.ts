import { IncomingHttpHeaders } from "http";
import { HttpStatusCode } from "../../types/http-status-code";

export interface IRequest<Input> {
    getRequest(): { body: Input, params: { [key: string]: string }; headers: IncomingHttpHeaders };
}

export interface IResponse<Output> {
    sendResponse(status: HttpStatusCode, data: Output): void;
}

export default abstract class Controller<Input, Output> {
    abstract handle(request: IRequest<Input>, response: IResponse<Output>): void;
}