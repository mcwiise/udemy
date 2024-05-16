namespace App {
  type Observer<T> = (items: T[]) => void;

  class State<T> {
    protected observers: Observer<T>[] = [];

    public addObserver(fn: Observer<T>): void {
      this.observers.push(fn);
    }
  }

  export class ProjectState extends State<Project> {
    private projects: Project[] = [];
    private static instance: ProjectState;

    public static getInstance() {
      if (this.instance) {
        return this.instance;
      } else {
        return new ProjectState();
      }
    }

    public addProject(
      title: string,
      description: string,
      people: number
    ): void {
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

  export const projectState = ProjectState.getInstance();
}
