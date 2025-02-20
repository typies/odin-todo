import SidebarModule from "./SidebarModule";
import mainPubSub from "./PubSub";
import TodoListModule from "./TodoListModule";
import PopUpFormFactory from "./PopUpFormFactory.js";
import PageProjectsManager from "./PageProjectsManager.js";

class HomePage {
    constructor() {
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

    setActiveProject(projectName) {
        this.activeProjectName = projectName;
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
        this.configureNewProjectSubmitButton(newProjectPopUp);
        document.body.appendChild(newProjectPopUp);
    }

    configureNewProjectSubmitButton(newPopUp) {
        newPopUp.addEventListener("submit", (event) => {
            event.preventDefault();
            const formData = new FormData(newPopUp.querySelector("form"));
            const newProjectName = formData.get("project-name");
            PageProjectsManager.addNewProject(newProjectName);
            SidebarModule.addNewSidebarItem(newProjectName);
            mainPubSub.publish("activeProjectChange", newProjectName);
            newPopUp.remove();
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
            const todoItemData = {
                title: formData.get("title"),
                description: formData.get("description"),
                dueDate: formData.get("date"),
                priority: formData.get("priority"),
                notes: formData.get("notes"),
                checkList: formData.get("checkList"),
                completed: formData.get("completed"),
            };
            if (!this.activeProjectName) {
                if (PageProjectsManager.sharedProjectList.length == 0) {
                    PageProjectsManager.addNewProject("Default");
                }
                this.activeProjectName = PageProjectsManager.sharedProjectList
                    .keys()
                    .next().value;
                mainPubSub.publish(
                    "activeProjectChange",
                    this.activeProjectName
                );
            }
            PageProjectsManager.addTodoItem(
                this.activeProjectName,
                todoItemData
            );
            TodoListModule.appendLatestToMainContent(this.activeProjectName);
            newPopUp.remove();
        });
    }

    render() {
        this.domElements.content.replaceChildren(
            SidebarModule.createSidebarSkeleton(),
            TodoListModule.createTodoListSkeleton()
        );
        SidebarModule.populateSidebar();
    }
}

export default new HomePage();
