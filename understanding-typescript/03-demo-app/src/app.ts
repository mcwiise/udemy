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

interface Draggable {
  dragStartHandler(event: DragEvent): void
  dragEndHandler(event: DragEvent): void
}

interface DragTarget{
  dragOverHandler(event: DragEvent): void
  dropHandler(event: DragEvent): void
  dragLeaveHandler(event: DragEvent): void
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
    this.updateListener();
  }

  moveProject(projectId: string, newStatus: ProjectStatus) {
    const project = this.projects.find(p => p.id === projectId)
    if(project && project.status !== newStatus) {
      project.status = newStatus;
      this.updateListener();
    }
  }

  private updateListener(){
    this.observers.forEach((observer) => observer(this.projects.slice()));
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

class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable{
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
    this.configure()
    this.insertElementIntoHost();
    this.renderContent();
  }

  configure(): void {
    this.elementToInsert.addEventListener("dragstart", this.dragStartHandler.bind(this))
    this.elementToInsert.addEventListener("dragend", this.dragEndHandler.bind(this))
  }

  renderContent(): void {
    this.elementToInsert.querySelector("h2")!.textContent = this.project.title;
    this.elementToInsert.querySelector("p")!.textContent =
      this.project.description;
    this.elementToInsert.querySelector("h3")!.textContent =
      this.persons + "assigned";
  }

  dragStartHandler(event: DragEvent): void {
    console.log("Drag start for: " + this.project.id)
    event.dataTransfer!.setData("text/plain", this.project.id)
    event.dataTransfer!.effectAllowed = "move"
  }

  dragEndHandler(_: DragEvent): void {
    console.log("Drag End")
  }
}

class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget{
  private assignedProjects: Project[];
  private type: "active" | "finished";

  constructor(type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);
    this.type = type;
    this.assignedProjects = [];
    this.configure();
    this.insertElementIntoHost();
    this.renderContent();
  }

  dragOverHandler(event: DragEvent): void {
    if(event.dataTransfer && event.dataTransfer.types[0] === "text/plain"){
      event.preventDefault()
      const listEl = this.elementToInsert.querySelector("ul")!
      listEl.classList.add("droppable")
    }
  }
  
  dropHandler(event: DragEvent): void {
    const projectId = event.dataTransfer!.getData("text/plain")
    projectState.moveProject(projectId, this.type === 'active'? ProjectStatus.Active: ProjectStatus.Finished)
  }
  
  dragLeaveHandler(_: DragEvent): void {
    const listEl = this.elementToInsert.querySelector("ul")!
    listEl.classList.remove("droppable")
  }

  configure() {
    this.elementToInsert.addEventListener("dragover", this.dragOverHandler.bind(this))
    this.elementToInsert.addEventListener("dragleave", this.dragLeaveHandler.bind(this))
    this.elementToInsert.addEventListener("drop", this.dropHandler.bind(this))

    projectState.addObserver((projects: Project[]) => {
      if (this.type === "active") {
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
  }

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

  private validate(_: Validatable): boolean {
    let isValid: boolean = true;

    return isValid;
  }
}

const projectInput = new ProjectInput();
const activeProjectList = new ProjectList("active");
const finishedProjectList = new ProjectList("finished");
