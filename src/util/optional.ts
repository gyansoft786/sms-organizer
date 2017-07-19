
export class Optional<T> {
    private readonly _some: Some<T>| null = null;
    private readonly _none: None | null = null;

    constructor(value: T| None) {
        if (value instanceof None) {
            this._none = value;
        } else {
            this._some = new Some<T>(value);
        }
    }

  public unwrap(): T {
    if (this._some != null ) {
      return this._some.get();
    } else {
      throw new Error("Attepmted to unwrap a None value");
    }
  }

  public unwrap_or( none_function: () => T): T {
    if (this._some != null ) {
      return this._some.get();
    } else if (this._none != null) {
      return none_function();
    } else {
      throw new Error("optional is in a bad state.")
    }
  }

    /**
     * executes the function if this.some is present,
     * otherwise do nothing.
     */ 
  public some_or( some_function: (value: T) => any): any {
    if (this._some != null ) {
        return some_function(this._some.get());
    }
  }

  public match( someFn: (value: T) => any, noneFn: () => any): any {
    if (this._some != null ) {
        return someFn(this._some.get());
    } else {
        return noneFn();
    }
  }
    
}

export class Some<T> {
  private readonly _value: T;

  constructor(value: T) {
    this._value = value;
  }

  public get(): T {
    return this._value;
  }
}

export class None {}