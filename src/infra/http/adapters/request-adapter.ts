import { Request } from 'express';
import { IRequest } from '../../../core/contracts/controller';

class RequestAdapter<Input> implements IRequest<Input> {
    constructor(private readonly req: Request) { }

    getRequest() {
        return {
            body: this.req.body as Input,
            params: this.req.params,
            headers: this.req.headers
        }
    }

}

export { RequestAdapter };