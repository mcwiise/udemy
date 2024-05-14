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

enum ProjectStatus {
  Active,
  Finished,
}

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

type observer = (projects: Project[]) => void;

class ProjectState {
  private projects: Project[];
  private observers: observer[];
  private static instance: ProjectState;

  private constructor() {
    this.projects = [];
    this.observers = [];
  }

  public static getInstance() {
    if (this.instance) {
      return this.instance;
    } else {
      return new ProjectState();
    }
  }

  public addProject(title: string, description: string, people: number): void {
    const strId = Math.random().toString();
    const projectToAdd = new Project(
      strId,
      title,
      description,
      people,
      ProjectStatus.Active
    );
    this.projects.push(projectToAdd);
    this.observers.forEach((observer) => observer(this.projects));
  }

  public addObserver(fn: observer): void {
    this.observers.push(fn);
  }
}

const projectState = ProjectState.getInstance();

class ProjectList {
  private type: "active" | "finished";
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  sectionElement: HTMLElement;
  private assignedProjects: Project[];

  constructor(type: "active" | "finished") {
    this.type = type;
    this.assignedProjects = [];
    this.templateElement = document.getElementById(
      "project-list"
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById("app")! as HTMLDivElement;
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.sectionElement = importedNode.firstElementChild as HTMLElement;
    this.sectionElement.id = `${this.type}-projects`;
    projectState.addObserver((projects: Project[]) => {
      this.assignedProjects.push(...projects);
      this.renderAssignedProjects();
    });
    this.attach();
    this.renderContent();
  }

  private renderAssignedProjects(): void {
    const listId = `${this.type}-project-list`;
    const ulistElement = document.getElementById(listId) as HTMLUListElement;
    this.assignedProjects.forEach((aproject) => {
      const elementList = document.createElement("li");
      elementList.textContent = aproject.title;
      ulistElement.appendChild(elementList);
    });
  }

  private renderContent() {
    const listId = `${this.type}-project-list`;
    this.sectionElement.querySelector("ul")!.id = listId;
    this.sectionElement.querySelector(
      "h2"
    )!.textContent = `${this.type.toUpperCase()} - PROJECTS`;
  }

  private attach(): void {
    this.hostElement.insertAdjacentElement("beforeend", this.sectionElement);
  }
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
const activeProjectList = new ProjectList("active");
const finishedProjectList = new ProjectList("finished");
