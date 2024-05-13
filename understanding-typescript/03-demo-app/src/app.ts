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

  private submitHandler(event: Event) {
    // prevents the form to make a POST call
    event.preventDefault();
    console.log("title entered: ", this.titleInputElement.value);
    console.log("description entered: ", this.descriptionInputElement.value);
    console.log("people entered: ", this.peopleInputElement.value);
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
