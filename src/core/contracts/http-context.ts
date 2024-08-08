import { HttpStatusCode } from "../../types/http-status-code";
import { IncomingHttpHeaders } from 'http'

interface HttpRequest<T> {
    body: T;
    params: { [key: string]: string };
    headers?: IncomingHttpHeaders;
}

interface HttpContext<Input, Output> {
    getRequest(): HttpRequest<Input>;
    sendResponse(status: HttpStatusCode, data: Output | string): void;
}

export { HttpContext, HttpRequest }