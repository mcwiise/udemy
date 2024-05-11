// declares a decoratior function
// that receives 3 parameters
// target -> the setter or getter function being decorated
// name -> the name of property associated to the getter or setter function
// descriptor -> the object that the function belongs to
function Log2(target: any, name: string, descriptor: PropertyDescriptor) {
  console.log("Accessor decorator!");
  console.log(target);
  console.log(name);
  console.log(descriptor);
}

// declares a decoratior function
// that receives 3 parameters
// target -> the regular function being decorated
// name -> the name of the function being decorated
// descriptor -> the object that the function belongs to
function Log3(
  target: any,
  name: string | Symbol,
  descriptor: PropertyDescriptor
) {
  console.log("Method decorator!");
  console.log(target);
  console.log(name);
  console.log(descriptor);
}

// declares a parameter decorator function
// that receives 3 parameters
// target -> the function where the parameter is declared
// name -> the name of the function being decorated
// position -> the position where the parameter is located
function Log4(target: any, name: string | Symbol, position: number) {
  console.log("Parameter decorator!");
  console.log(target);
  console.log(name);
  console.log(position);
}

class Product {
  title: string;
  private _price: number;

  constructor(t: string, p: number) {
    this.title = t;
    this._price = p;
  }

  @Log2
  set price(p: number) {
    if (p > 0) {
      this._price = p;
    } else {
      throw new Error("Cannot handle negative prices");
    }
  }

  @Log3
  getPriceWwithTax(@Log4 tax: number): number {
    return this._price * tax;
  }
}
