import SidebarModule from "./SidebarModule";
import mainPubSub from "./PubSub";
import TodoListModule from "./TodoListModule";
import PopUpFormFactory from "./PopUpFormFactory.js";
import Project from "./Project";

class HomePage {
    constructor() {
        this.projects = [];
        mainPubSub.subscribe(
            "todoItemCompletionChange",
            this.updateTodoItem.bind(this)
        );
        mainPubSub.subscribe(
            "newProjectBtnPressed",
            this.openNewProjectPopUp.bind(this)
        );
    }
    domElements = {
        content: document.querySelector("#content"),
    };

    openNewProjectPopUp() {
        const newProjectFormInputs = [
            {
                labelText: "Project Name",
                id: "project-name",
                elementType: "input",
                type: "text",
                class: "form-input",
                name: "project-name",
                required: true,
            },
        ];
        const newProjectPopUp =
            PopUpFormFactory.createPopUp(newProjectFormInputs);
        this.configureSubmitButton(newProjectPopUp);
        document.body.appendChild(newProjectPopUp);
    }

    configureSubmitButton(newPopUp) {
        newPopUp.addEventListener("submit", (event) => {
            event.preventDefault();
            const formData = new FormData(newPopUp.querySelector("form"));
            const newProject = this.addNewProject(formData.get("project-name"));
            newPopUp.remove();
            mainPubSub.publish("activeProjectChange", newProject);
        });
    }

    addNewProject(projectName) {
        const newProject = new Project(projectName);
        this.projects.push(newProject);
        SidebarModule.addNewSidebarItem(newProject);
        return newProject;
    }

    updateTodoItem(data) {
        const matchingProject = this.projects.find(
            (project) => project.projectName == data.projectName
        );

        matchingProject.toggleTodoItemStatus(data.todoItem.title);
    }

    render() {
        this.domElements.content.replaceChildren(
            SidebarModule.createSidebarSkeleton(),
            TodoListModule.createTodoListSkeleton()
        );
        SidebarModule.populateSidebar(this.projects);
    }
}

export default new HomePage();
