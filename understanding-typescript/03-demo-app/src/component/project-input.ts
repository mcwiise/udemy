import { Component } from "./base-component.js";
import { projectState } from "../state/project-state.js";
import { validate } from "../util/validation.js";

export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    super("project-input", "app", true, "user-input");
    this.titleInputElement = this.guestElement.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descriptionInputElement = this.guestElement.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInputElement = this.guestElement.querySelector(
      "#people"
    ) as HTMLInputElement;
    this.configure();
    this.insertGuestElementIntoHost();
  }

  configure(): void {
    this.guestElement.addEventListener("submit", this.submitHandler.bind(this));
  }

  renderContent(): void {}

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
      projectState.addProject(title, description, people);
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
      !validate({
        value: enteredTitle,
        required: true,
        minLength: 10,
        maxLength: 20,
      }) ||
      !validate({
        value: enteredDescription,
        required: true,
        minLength: 10,
        maxLength: 20,
      }) ||
      !validate({
        value: enteredPeople,
        required: true,
        min: 1,
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
}
