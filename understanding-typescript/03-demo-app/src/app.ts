interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjDescriptor;
}

class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  projectInputFormElement: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    this.templateElement = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById("app")! as HTMLDivElement;
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.projectInputFormElement =
      importedNode.firstElementChild as HTMLFormElement;
    this.projectInputFormElement.id = "user-input";
    this.titleInputElement = this.projectInputFormElement.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descriptionInputElement = this.projectInputFormElement.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInputElement = this.projectInputFormElement.querySelector(
      "#people"
    ) as HTMLInputElement;
    this.configure();
    this.attach();
  }

  // In the context of event handlers,
  // the value of "this" keyword references the html element that trigggers the event,
  // then we have to submitHandler.bind(this) when using submitHandler as callback
  // @autobind
  private submitHandler(event: Event) {
    // prevents the form to make a servlet call
    event.preventDefault();
    const userInput = this.getUserInput();
    if (Array.isArray(userInput)) {
      const [title, description, people] = userInput;
      console.log(title);
      console.log(description);
      console.log(people);
    }
    this.clearInputs();
  }

  private clearInputs() {
    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
    this.peopleInputElement.value = "";
  }

  private getUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    if (
      !this.validate({
        value: enteredTitle,
        required: true,
        minLength: 10,
        maxLength: 20,
      }) ||
      !this.validate({
        value: enteredDescription,
        required: true,
        minLength: 10,
        maxLength: 20,
      }) ||
      !this.validate({
        value: enteredPeople,
        required: true,
        min: 10,
        max: 20,
      })
    ) {
      alert("Invalid input, please try again. ");
      return;
    } else {
      return [
        this.titleInputElement.value,
        this.descriptionInputElement.value,
        // use the + character to convert from string to number
        +this.peopleInputElement.value,
      ];
    }
  }

  private validate(input: Validatable): boolean {
    let isValid: boolean = true;
    if (input.required) {
      isValid = isValid && input.value.toString().trim().length > 0;
    }
    if (input.minLength && typeof input.value === "string") {
      isValid = isValid && input.value.trim().length >= input.minLength;
    }
    if (input.maxLength && typeof input.value === "string") {
      isValid = isValid && input.value.trim().length <= input.maxLength;
    }
    if (input.min && typeof input.value === "number") {
      isValid = isValid && input.value <= input.min;
    }
    if (input.max && typeof input.value === "number") {
      isValid = isValid && input.value >= input.max;
    }
    return isValid;
  }
  private configure(): void {
    this.projectInputFormElement.addEventListener(
      "submit",
      this.submitHandler.bind(this)
    );
  }

  private attach(): void {
    this.hostElement.insertAdjacentElement(
      "afterbegin",
      this.projectInputFormElement
    );
  }
}

const projectInput = new ProjectInput();
