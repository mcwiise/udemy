function add(n1: number, n2: number): number {
  return n1 + n2;
}

function printResult(num: number) {
  console.log("Result: " + num);
}

function addAndHandle(a: number, b: number, cb: (num: number) => void): void {
  const result = a + b;
  cb(result);
}

printResult(add(1, 2));

let combineValues: (a: number, b: number) => number;
combineValues = add;

console.log(combineValues(2, 3));

addAndHandle(5, 6, (result) => {
  console.log(result);
});
