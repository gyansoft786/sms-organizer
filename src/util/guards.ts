

export class Guards {
  public static stringGuard(value: string| undefined): value is string {
    return value != undefined;

  }
}