type Constructor<T> = new (...args: any[]) => T;

export class Mapped<T, OBJ> {
  private model: Constructor<T>;

  constructor(model: Constructor<T>) {
    this.model = model;
  }

  mapped(objToMapped: OBJ) {
    return new this.model({ ...objToMapped });
  }
}
