import { Component } from "./base-component.js";
import { Draggable } from "../model/drag-and-drop.js";
import { Project } from "../model/project.js";

/**
 * This class represents a project from a user interface point of view.
 * Technically, it is a list item html element:
 * <li>
 *   <h2></h2>
 *   <h3></h3>
 *   <p></p>
 * </li>
 */
export class ProjectItem
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
