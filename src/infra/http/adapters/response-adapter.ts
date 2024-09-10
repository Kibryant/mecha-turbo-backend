import { Response } from 'express';
import { IResponse } from "../../../core/contracts/controller";

class ResponseAdapter<Output> implements IResponse<Output> {
    constructor(private readonly res: Response) { }

    sendResponse(statusCode: number, body: Output) {
        this.res.status(statusCode).json(body);
    }
}

export { ResponseAdapter };