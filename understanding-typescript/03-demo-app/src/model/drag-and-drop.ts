/**
 * The Draggable interface provides absract methods that react
 * to the action of dragging a html element in the browser.
 */
export interface Draggable {
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
export interface DragTarget {
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
