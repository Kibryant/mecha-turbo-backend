import { Result } from "./result";

export default abstract class UseCase<Input, Output extends Result<unknown>> {
    abstract execute(input: Input): Promise<Output>;
}