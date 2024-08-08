import { HttpStatusCode } from "../../types/http-status-code";

interface HttpRequest<T> {
    body: T;
    params: { [key: string]: string };
}

interface HttpContext<T> {
    getRequest(): HttpRequest<T>;
    sendResponse(status: HttpStatusCode, data: T | null): void;
}

export { HttpContext, HttpRequest }