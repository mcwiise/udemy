import { DragTarget } from "../model/drag-and-drop.js";
import { Project, ProjectStatus } from "../model/project.js";
import { projectState } from "../state/project-state.js";
import { Component } from "./base-component.js";
import { ProjectItem } from "./project-item.js";

/**
 * This class represents a list of active or finished projects,
 * that are rendered in 2 different <ul> elements from the visual point of view
 */
export class ProjectList
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
