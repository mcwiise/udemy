let userInput: unknown;
let userName: string;

userInput = 5;
userInput = "germanchis";

if (typeof userInput === "string") {
  userName = userInput;
}

function generateError(message: string, code: number) {
  throw { message: message, errorCode: code };
}

const result = generateError("error happens", 500);
console.log(result);
