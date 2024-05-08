type Combinable = number | string;
type ConversionDescriptor = "as-number" | "as-text";

function combine(
  input1: Combinable,
  input2: Combinable,
  resultConvertion: ConversionDescriptor
) {
  let result: number | string;
  if (
    (typeof input1 === "number" && typeof input2 === "number") ||
    resultConvertion === "as-number"
  ) {
    result = +input1 + +input2;
  } else {
    result = input1.toString() + input2.toString();
  }
  return result;
}

const combinedAges = combine(30, 26, "as-number");
console.log(combinedAges);
const combinedStringAges = combine(30, 26, "as-text");
console.log(combinedStringAges);
const combinedNames = combine("Max", "Ana", "as-text");
console.log(combinedNames);
