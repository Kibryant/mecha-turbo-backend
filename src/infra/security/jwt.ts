import jwt from "jsonwebtoken";
import { JwtService } from "../../core/contracts/jwt-service";

class Jwt implements JwtService {
    sign(payload: any, secret: string, options?: jwt.SignOptions): string {
        return jwt.sign(payload, secret, options);
    }

    verify(token: string, secret: string): any {
        return jwt.verify(token, secret);
    }
}

export { Jwt }