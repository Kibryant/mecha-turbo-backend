class Result<T> {
    public isSuccess: boolean;
    public isFailure: boolean;
    public error?: string;
    private _value: T;

    private constructor(isSuccess: boolean, error?: string, value?: T) {
        if (isSuccess && error) {
            throw new Error(
                'InvalidOperation: A result cannot be successful and contain an error'
            );
        }
        if (!isSuccess && !error) {
            throw new Error(
                'InvalidOperation: A failing result needs to contain an error message'
            );
        }

        this.isSuccess = isSuccess;
        this.isFailure = !isSuccess;
        this.error = error;
        this._value = value as T;
        Object.freeze(this);
    }

    get value(): T {
        if (!this.isSuccess) {
            throw new Error(`Cant retrieve the value from a failed result.`)
        }

        return this._value;
    }

    public static ok<U>(value?: U): Result<U> {
        return new Result<U>(true, undefined, value);
    }

    public static fail<U>(error: string): Result<U> {
        return new Result<U>(false, error);
    }

    public getErrorValue(): string {
        if (!this.error) {
            throw new Error("Cant retrieve the error message from a successful result.");
        }

        return this.error as string;
    }
}

export { Result }