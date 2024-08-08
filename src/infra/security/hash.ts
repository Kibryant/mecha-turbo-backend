import * as bcrypt from "bcrypt";
import { HashService } from "../../core/contracts/hash-service";


class Hash implements HashService {
    async hash(value: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(value, salt);
        return hash;
    }

    async compare(value: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(value, hash);
    }

}

export { Hash }