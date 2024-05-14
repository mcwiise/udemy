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

type Observer<T> = (items: T[]) => void;

class State<T> {
  protected observers: Observer<T>[] = [];

  public addObserver(fn: Observer<T>): void {
    this.observers.push(fn);
  }
}

class ProjectState extends State<Project> {
  private projects: Project[] = [];
  private static instance: ProjectState;

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
}

const projectState = ProjectState.getInstance();

abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  elementToInsert: U;
  insertElementAtStart: boolean;

  constructor(
    templateId: string,
    hostElementId: string,
    insertElementAtStart: boolean,
    elementToIsertId?: string
  ) {
    this.templateElement = document.getElementById(
      templateId
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostElementId)! as T;
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.elementToInsert = importedNode.firstElementChild as U;
    if (elementToIsertId) {
      this.elementToInsert.id = elementToIsertId;
    }
    this.insertElementAtStart = insertElementAtStart;
  }

  insertElementIntoHost(): void {
    this.hostElement.insertAdjacentElement(
      this.insertElementAtStart ? "afterbegin" : "beforeend",
      this.elementToInsert
    );
  }

  abstract configure(): void;
  abstract renderContent(): void;
}

class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> {
  private project: Project;

  get persons() {
    if (this.project.people === 1) {
      return "1 person ";
    } else {
      return this.project.people + " people ";
    }
  }

  constructor(rootListId: string, project: Project) {
    super("single-project", rootListId, false, project.id);
    this.project = project;
    this.insertElementIntoHost();
    this.renderContent();
  }

  configure(): void {}

  renderContent(): void {
    this.elementToInsert.querySelector("h2")!.textContent = this.project.title;
    this.elementToInsert.querySelector("p")!.textContent =
      this.project.description;
    this.elementToInsert.querySelector("h3")!.textContent =
      this.persons + "assigned";
  }
}

class ProjectList extends Component<HTMLDivElement, HTMLElement> {
  private assignedProjects: Project[];
  private type: "active" | "finished";

  constructor(type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);
    this.type = type;
    this.assignedProjects = [];

    projectState.addObserver((projects: Project[]) => {
      if (type === "active") {
        this.assignedProjects = projects.filter(
          (project) => project.status === ProjectStatus.Active
        );
      } else {
        this.assignedProjects = projects.filter(
          (project) => project.status === ProjectStatus.Finished
        );
      }
      this.renderAssignedProjects();
    });
    this.insertElementIntoHost();
    this.renderContent();
  }

  configure() {}

  renderContent() {
    const listId = `${this.type}-project-list`;
    this.elementToInsert.querySelector("ul")!.id = listId;
    this.elementToInsert.querySelector(
      "h2"
    )!.textContent = `${this.type.toUpperCase()} - PROJECTS`;
  }

  private renderAssignedProjects(): void {
    const ulistId = `${this.type}-project-list`;
    const ulistElement = document.getElementById(ulistId) as HTMLUListElement;
    ulistElement.innerHTML = "";
    this.assignedProjects.forEach((aproject) => {
      const pitem = new ProjectItem(ulistId, aproject);
      pitem.renderContent();
    });
  }
}

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    super("project-input", "app", true, "user-input");
    this.titleInputElement = this.elementToInsert.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descriptionInputElement = this.elementToInsert.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInputElement = this.elementToInsert.querySelector(
      "#people"
    ) as HTMLInputElement;
    this.configure();
    this.insertElementIntoHost();
  }

  configure(): void {
    this.elementToInsert.addEventListener(
      "submit",
      this.submitHandler.bind(this)
    );
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
}

const projectInput = new ProjectInput();
const activeProjectList = new ProjectList("active");
const finishedProjectList = new ProjectList("finished");
