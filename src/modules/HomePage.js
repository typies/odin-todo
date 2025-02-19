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
        mainPubSub.subscribe(
            "newTodoItemBtnPressed",
            this.openNewTodoItemPopUp.bind(this)
        );
        mainPubSub.subscribe(
            "activeProjectChange",
            this.setActiveProject.bind(this)
        );
    }
    domElements = {
        content: document.querySelector("#content"),
    };

    setActiveProject(project) {
        this.activeProject = project;
    }

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
        this.configureProjectSubmitButton(newProjectPopUp);
        document.body.appendChild(newProjectPopUp);
    }

    configureProjectSubmitButton(newPopUp) {
        newPopUp.addEventListener("submit", (event) => {
            event.preventDefault();
            const formData = new FormData(newPopUp.querySelector("form"));
            const newProject = this.addNewProject(formData.get("project-name"));
            newPopUp.remove();
            mainPubSub.publish("activeProjectChange", newProject);
        });
    }

    openNewTodoItemPopUp() {
        const newProjectFormInputs = [
            {
                labelText: "Title",
                id: "title",
                elementType: "input",
                type: "text",
                class: "title-input",
                name: "title",
                required: true,
            },
            {
                labelText: "Description",
                id: "description",
                elementType: "input",
                type: "text",
                class: "description-input",
                name: "description",
                required: false,
            },
            {
                labelText: "Due Date",
                id: "date",
                elementType: "input",
                type: "date",
                class: "date-input",
                name: "date",
                required: true,
            },
            {
                labelText: "Priority",
                id: "priority",
                elementType: "input",
                type: "text",
                class: "priority-input",
                name: "priority",
                required: false,
            },
            {
                labelText: "Notes",
                id: "notes",
                elementType: "input",
                type: "text",
                class: "notes-input",
                name: "notes",
                required: false,
            },
            // {
            //     labelText: "CheckList",
            //     id: "title",
            //     elementType: "input",
            //     type: "text",
            //     class: "title-input",
            //     name: "title",
            //     required: true,
            // },
            {
                labelText: "Completed",
                id: "completed",
                elementType: "input",
                type: "checkbox",
                class: "completed-input",
                name: "completed",
                required: false,
            },
        ];
        const newProjectPopUp =
            PopUpFormFactory.createPopUp(newProjectFormInputs);
        this.configureTodoItemSubmitButton(newProjectPopUp);
        document.body.appendChild(newProjectPopUp);
    }

    configureTodoItemSubmitButton(newPopUp) {
        newPopUp.addEventListener("submit", (event) => {
            event.preventDefault();
            const formData = new FormData(newPopUp.querySelector("form"));
            const todoItem = {
                title: formData.get("title"),
                description: formData.get("description"),
                dueDate: formData.get("date"),
                priority: formData.get("priority"),
                notes: formData.get("notes"),
                checkList: formData.get("checkList"),
                completed: formData.get("completed"),
            };
            if (!this.activeProject) {
                if (this.projects.length == 0) {
                    addNewProject("Default");
                }
                this.activeProject = this.projects[0];
            }
            this.activeProject.todoItems.set(todoItem.title, todoItem);
            mainPubSub.publish("activeProjectChange", this.activeProject);
            newPopUp.remove();
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
