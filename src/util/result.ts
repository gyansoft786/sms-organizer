
export class result<T, E> {
    private readonly _ok: Ok<T>| null;
    private readonly _err: Err<E>| null;

    constructor(value: Ok<T> | Err<E>) {
        if (value instanceof Ok) { 
            this._ok = value;
        } else {
            this._err = value;
        }
    }

    public unwrap(): T {
        if (this._ok != null ) {
            return this._ok.get();
        } else {
            throw new Error (`Tried to unwrap an Err. Err value: ${this._err}`)
        }
    }

    public match( someFn: (value: T) => any, errFn: (err: E) => any): any {
        if (this._ok != null ) {
            return someFn(this._ok.get());
        } else if (this._err != null) {
            return errFn(this._err.get());
        } 
        // This will not throw an error.
    }
}

export class Ok<T> {
    private readonly _ok: T;

    constructor(value: T) {
        this._ok = value;
    }

    public get(): T {
        return this._ok;
    }

}

export class Err<E> {
    private readonly _err: E;

    constructor(value: E) {
        this._err = value;
    }

    public get(): E {
        return this._err;
    }
}

