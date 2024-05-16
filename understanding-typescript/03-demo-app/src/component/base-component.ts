/**
 * Component is a generic class which implements an algorithm to modify
 * the DOM in real-time:
 * 1. get a <template> from index.html, it contains the guest element to render.
 * 2. get the host element where the content (guest element) is rendered.
 * 3. get the guest element from the template, and insert it into the host element.
 */
export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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
