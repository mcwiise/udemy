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

/**
 * The Draggable interface provides absract methods that react
 * to the action of dragging a html element in the browser.
 */
interface Draggable {
  /**
   * This method is called as soon as the user clicks and starts dragging the element.
   * @param event: the event generated.
   */
  dragStartHandler(event: DragEvent): void;

  /**
   * this method is called as soon as the user releases the click on the element.
   * @param event: the event generated.
   */
  dragEndHandler(event: DragEvent): void;
}

/**
 * The DragTarget interface provides absract methods that react
 * to the action of dropping a html element to a target area.
 */
interface DragTarget {
  /**
   * This method is called when the html element goes over the target area
   */
  dragOverHandler(event: DragEvent): void;
  /**
   * This method is called as soon as the user drops the html element to the target area
   */
  dropHandler(event: DragEvent): void;
  /**
   * This method is called when the html element leaves the source area
   */
  dragLeaveHandler(event: DragEvent): void;
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
    const project = this.projects.find((p) => p.id === projectId);
    if (project && project.status !== newStatus) {
      project.status = newStatus;
      this.updateListener();
    }
  }

  private updateListener() {
    this.observers.forEach((observer) => observer(this.projects.slice()));
  }
}

const projectState = ProjectState.getInstance();

/**
 * Component is a generic class which implements an algorithm to modify
 * the DOM in real-time:
 * 1. get a <template> from index.html, it contains the guest element to render.
 * 2. get the host element where the content (guest element) is rendered.
 * 3. get the guest element from the template, and insert it into the host element.
 */
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  guestElement: U;
  insertGuestElementAtStart: boolean;

  /**
   * This method is called when an instance of a class is created.
   * @param templateId: the id attribute of the html template
   * @param hostElementId: the id attribute of the host html element
   * @param insertGuestElementAtStart: the value of "true" places the guest element after the start tag,
   * and "false" before the end tag of the host html element
   * @param guestElementId: the id attribute of the guest html element
   */
  constructor(
    templateId: string,
    hostElementId: string,
    insertGuestElementAtStart: boolean,
    guestElementId?: string
  ) {
    // getElementById could return null
    // so we use ! to tell typescript that the element we are looking for is always present
    this.templateElement = document.getElementById(
      templateId
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostElementId)! as T;

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );

    this.guestElement = importedNode.firstElementChild as U;
    if (guestElementId) {
      this.guestElement.id = guestElementId;
    }

    this.insertGuestElementAtStart = insertGuestElementAtStart;
  }

  /**
   * inserts the guest html element into the host element,
   * where insertGuestElementAtStart determines the position the element is inserted in
   */
  insertGuestElementIntoHost(): void {
    this.hostElement.insertAdjacentElement(
      this.insertGuestElementAtStart ? "afterbegin" : "beforeend",
      this.guestElement
    );
  }

  /**
   * Additional logic to perform when the component is initialized
   */
  abstract configure(): void;

  /**
   * Sets the data to render in the guest html element
   */
  abstract renderContent(): void;
}

/**
 * This class represents a project from a user interface point of view.
 * Technically, it is a list item html element:
 * <li>
 *   <h2></h2>
 *   <h3></h3>
 *   <p></p>
 * </li>
 */
class ProjectItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable
{
  private static HTML_TEMPLATE_ID: string = "single-project";
  private project: Project;

  get persons() {
    if (this.project.people === 1) {
      return "1 person ";
    } else {
      return this.project.people + " people ";
    }
  }
  /**
   * class constructor method
   * @param hostElementId: the id attribute of <ul> element the project item will be rndered
   * @param project: the data to render the element with
   */
  constructor(hostElementId: string, project: Project) {
    super(ProjectItem.HTML_TEMPLATE_ID, hostElementId, false, project.id);
    this.project = project;
    this.configure();
    this.insertGuestElementIntoHost();
    this.renderContent();
  }

  /**
   *
   */
  dragStartHandler(event: DragEvent): void {
    console.log("Drag start for: " + this.project.id);
    event.dataTransfer!.setData("text/plain", this.project.id);
    event.dataTransfer!.effectAllowed = "move";
  }

  /**
   *
   */
  dragEndHandler(_: DragEvent): void {
    console.log("Drag End");
  }

  /**
   * Registers the handlers that react to
   * the events that happen on the project list item,
   * in other words, the events on <li> element
   */
  configure(): void {
    this.guestElement.addEventListener(
      "dragstart",
      this.dragStartHandler.bind(this)
    );
    this.guestElement.addEventListener(
      "dragend",
      this.dragEndHandler.bind(this)
    );
  }

  /**
   * Looks for the <h2>, <p> and <h3> in the guest html element,
   * and set them with the project item details.
   */
  renderContent(): void {
    this.guestElement.querySelector("h2")!.textContent = this.project.title;
    this.guestElement.querySelector("p")!.textContent =
      this.project.description;
    this.guestElement.querySelector("h3")!.textContent =
      this.persons + "assigned";
  }
}

/**
 * This class represents a list of active or finished projects,
 * that are rendered in 2 different <ul> elements from the visual point of view
 */
class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements DragTarget
{
  private assignedProjects: Project[];
  private type: "active" | "finished";

  /**
   * constructor class
   * @param type: the type of project list to render.
   * Active projects are rendered in a blue <ul> element
   * and finished projects in a red <ul> element.
   */
  constructor(type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);
    this.type = type;
    this.assignedProjects = [];
    this.configure();
    this.insertGuestElementIntoHost();
    this.renderContent();
  }

  /**
   * when the project item goes over the target project list,
   * this method gets the target project list <ul>,
   * and changes its class to "droppable"
   */
  dragOverHandler(event: DragEvent): void {
    if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
      event.preventDefault();
      const listEl = this.guestElement.querySelector("ul")!;
      listEl.classList.add("droppable");
    }
  }

  /**
   * once the user drops the project item to the target project list,
   * this method moves the project from active to finished and viceverza
   */
  dropHandler(event: DragEvent): void {
    const projectId = event.dataTransfer!.getData("text/plain");
    projectState.moveProject(
      projectId,
      this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished
    );
  }

  /**
   * when the html element leaves the source project list,
   * this method lookks for the source project list html element <ul>,
   * and removes its class attribute
   */
  dragLeaveHandler(_: DragEvent): void {
    const listEl = this.guestElement.querySelector("ul")!;
    listEl.classList.remove("droppable");
  }

  /**
   * This method registers the handlers as event listeners for the
   * guest html element.
   * This also registers the observer function in
   * the ProjectState singleton that is called whenever the user
   * creates or moves a project item across project lists.
   */
  configure() {
    this.guestElement.addEventListener(
      "dragover",
      this.dragOverHandler.bind(this)
    );
    this.guestElement.addEventListener(
      "dragleave",
      this.dragLeaveHandler.bind(this)
    );
    this.guestElement.addEventListener("drop", this.dropHandler.bind(this));

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

  /**
   * this method looks for the project list,
   * and reders a different <ul> either for active or finished projects
   */
  renderContent() {
    const listId = `${this.type}-project-list`;
    this.guestElement.querySelector("ul")!.id = listId;
    this.guestElement.querySelector(
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
