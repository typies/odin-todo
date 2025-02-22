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
            "editProjectBtnPressed",
            this.openEditProjectPopUp.bind(this)
        );
        mainPubSub.subscribe(
            "newTodoItemBtnPressed",
            this.openNewTodoItemPopUp.bind(this)
        );
        mainPubSub.subscribe(
            "editButtonPressed",
            this.openEditTodoItemPopUp.bind(this)
        );
        mainPubSub.subscribe(
            "activeProjectChange",
            this.setActiveProject.bind(this)
        );
        mainPubSub.subscribe(
            "deletedProject",
            this.handleDeletedProject.bind(this)
        );
    }
    domElements = {
        content: document.querySelector("#content"),
    };

    handleDeletedProject(projectName) {
        if (this.activeProjectName == projectName) {
            this.activeProjectName = null;
            TodoListModule.replaceMainContent();
        }
    }

    setActiveProject(projectName) {
        this.activeProjectName = projectName;
    }

    openNewProjectPopUp() {
        const newProjectPopUp = PopUpFormFactory.createNewProjectPopUp();
        this.configureNewProjectSubmitButton(newProjectPopUp);
        document.body.appendChild(newProjectPopUp);
    }

    openEditProjectPopUp(projectName) {
        const editProjectPopUp =
            PopUpFormFactory.createEditProjectPopUp(projectName);
        this.configureEditProjectSubmitButton(projectName, editProjectPopUp);
        document.body.appendChild(editProjectPopUp);
    }

    configureNewProjectSubmitButton(newPopUp) {
        newPopUp.addEventListener("submit", (event) => {
            event.preventDefault();
            const formData = new FormData(newPopUp.querySelector("form"));
            const newProjectName = formData.get("project-name");
            if (PageProjectsManager.addNewProject(newProjectName)) {
                SidebarModule.addNewSidebarItem(newProjectName);
            }
            mainPubSub.publish("activeProjectChange", newProjectName);
            newPopUp.remove();
        });
    }

    configureEditProjectSubmitButton(oldProjectName, newPopUp) {
        newPopUp.addEventListener("submit", (event) => {
            event.preventDefault();
            const formData = new FormData(newPopUp.querySelector("form"));
            const newProjectName = formData.get("project-name");
            PageProjectsManager.updateProjectName(
                oldProjectName,
                newProjectName
            );
            SidebarModule.replaceSidebarItem(oldProjectName, newProjectName);
            newPopUp.remove();
        });
    }

    openNewTodoItemPopUp() {
        const newProjectPopUp = PopUpFormFactory.createNewTodoItemPopUp();
        this.configureTodoItemSubmitButton(newProjectPopUp);
        document.body.appendChild(newProjectPopUp);
    }

    openEditTodoItemPopUp(data) {
        const editProjectPopUp = PopUpFormFactory.createEditTodoItemPopUp(
            data.todoItem
        );
        this.configureEditTodoItemSubmitButton(editProjectPopUp);
        document.body.appendChild(editProjectPopUp);
    }

    configureEditTodoItemSubmitButton(newPopUp) {
        newPopUp.addEventListener("submit", (event) => {
            event.preventDefault();
            const formData = new FormData(newPopUp.querySelector("form"));
            const todoItemData = {
                title: formData.get("title"),
                description: formData.get("description"),
                date: formData.get("date"),
                priority: formData.get("priority"),
                notes: formData.get("notes"),
                checkList: formData.get("checkList"),
                completed: formData.get("completed") == "on",
            };
            const newTodoItem = PageProjectsManager.replaceTodoItem(
                this.activeProjectName,
                todoItemData
            );
            TodoListModule.replaceTodoInMainContent(
                this.activeProjectName,
                PageProjectsManager.getTodoItemIndex(
                    this.activeProjectName,
                    newTodoItem.title
                ),
                newTodoItem
            );
            newPopUp.remove();
        });
    }

    configureTodoItemSubmitButton(newPopUp) {
        newPopUp.addEventListener("submit", (event) => {
            event.preventDefault();
            const formData = new FormData(newPopUp.querySelector("form"));
            const todoItemData = {
                title: formData.get("title"),
                description: formData.get("description"),
                date: formData.get("date"),
                priority: formData.get("priority"),
                notes: formData.get("notes"),
                checkList: formData.get("checkList"),
                completed: formData.get("completed") == "on",
            };
            if (!this.activeProjectName) {
                this.setUpDefaultProject();
            }
            if (
                !PageProjectsManager.getTodoItem(
                    this.activeProjectName,
                    todoItemData.title
                )
            ) {
                const newTodoItem = PageProjectsManager.addTodoItem(
                    this.activeProjectName,
                    todoItemData
                );
                TodoListModule.addTodoItem(this.activeProjectName, newTodoItem);
            }
            newPopUp.remove();
        });
    }

    setUpDefaultProject() {
        if (PageProjectsManager.sharedProjectList.size == 0) {
            PageProjectsManager.addNewProject("Default");
        }
        this.activeProjectName = PageProjectsManager.sharedProjectList
            .keys()
            .next().value;
        SidebarModule.addNewSidebarItem(this.activeProjectName);
        mainPubSub.publish("activeProjectChange", this.activeProjectName);
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
