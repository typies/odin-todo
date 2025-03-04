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
            "deletedProject",
            this.handleDeletedProject.bind(this)
        );
        mainPubSub.subscribe(
            "newTodoItemBtnPressed",
            this.openNewTodoItemPopUp.bind(this)
        );
        mainPubSub.subscribe(
            "editTodoButtonPressed",
            this.openEditTodoItemPopUp.bind(this)
        );
        mainPubSub.subscribe(
            "activeProjectChange",
            this.setActiveProject.bind(this)
        );
    }

    handleDeletedProject(projectName) {
        PageProjectsManager.deleteProject(projectName);
        if (this.activeProjectName == projectName) {
            this.activeProjectName = null;
            mainPubSub.publish("activeProjectChange", this.activeProjectName);
        }
    }

    setActiveProject(projectName) {
        this.activeProjectName = projectName;
        TodoListModule.replaceMainContent(
            projectName,
            PageProjectsManager.getProject(projectName)
        );
    }

    openNewProjectPopUp() {
        const newProjectPopUp = PopUpFormFactory.createNewProjectPopUp();
        this.configureProjectSubmitButton(newProjectPopUp, (newProjectName) => {
            if (PageProjectsManager.addNewProject(newProjectName)) {
                SidebarModule.addNewSidebarItem(newProjectName);
            }
            mainPubSub.publish("activeProjectChange", newProjectName);
        });
        document.body.appendChild(newProjectPopUp);
    }

    openEditProjectPopUp(projectName) {
        const editProjectPopUp =
            PopUpFormFactory.createEditProjectPopUp(projectName);
        this.configureProjectSubmitButton(
            editProjectPopUp,
            (newProjectName) => {
                PageProjectsManager.updateProjectName(
                    projectName,
                    newProjectName
                );
                SidebarModule.replaceSidebarItem(projectName, newProjectName);
                SidebarModule.changeActiveProject(newProjectName);
            }
        );
        document.body.appendChild(editProjectPopUp);
    }

    configureProjectSubmitButton(newPopUp, fn) {
        newPopUp.addEventListener("submit", (event) => {
            event.preventDefault();
            const formData = new FormData(newPopUp.querySelector("form"));
            const newProjectName = formData.get("project-name");
            fn(newProjectName);
            newPopUp.remove();
        });
    }

    openNewTodoItemPopUp() {
        const newProjectPopUp = PopUpFormFactory.createNewTodoItemPopUp();
        this.configureTodoItemSubmitButton(newProjectPopUp, (todoItemData) => {
            if (!PageProjectsManager.getProject(this.activeProjectName))
                this.setDefaultProject();

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
        });
        document.body.appendChild(newProjectPopUp);
    }

    openEditTodoItemPopUp(data) {
        const editProjectPopUp = PopUpFormFactory.createEditTodoItemPopUp(
            data.todoItem
        );
        this.configureTodoItemSubmitButton(editProjectPopUp, (todoItemData) => {
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
        });
        document.body.appendChild(editProjectPopUp);
    }

    configureTodoItemSubmitButton(newPopUp, fn) {
        newPopUp.addEventListener("submit", (event) => {
            event.preventDefault();
            const formData = new FormData(newPopUp.querySelector("form"));
            const todoItemData =
                PageProjectsManager.createTodoItemFromFormData(formData);
            fn(todoItemData);
            newPopUp.remove();
        });
    }

    setDefaultProject() {
        if (PageProjectsManager.sharedProjectList.size == 0) {
            PageProjectsManager.addNewProject("Default");
            SidebarModule.addNewSidebarItem("Default");
        }
        this.activeProjectName = PageProjectsManager.sharedProjectList
            .keys()
            .next().value;
        mainPubSub.publish("activeProjectChange", this.activeProjectName);
    }

    render() {
        document
            .querySelector("#content")
            .replaceChildren(
                SidebarModule.createSidebarSkeleton(),
                TodoListModule.createTodoListSkeleton()
            );
        SidebarModule.populateSidebar(
            PageProjectsManager.sharedProjectList.keys()
        );
        this.setDefaultProject();
    }
}

export default new HomePage();
