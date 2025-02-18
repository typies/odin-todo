class HomePage {
    constructor() {
        this.projects = [];
    }
    domElements = {
        header: document.querySelector("header"),
        content: document.querySelector("#content"),
    };

    render() {
        this.createPageSkeleton();
        this.populateSidebar(this.projects);

        // Default page load active project
        this.activeProject = this.projects[0];
        this.populateMainContent(this.activeProject);
    }

    createPageSkeleton() {
        this.domElements.content.replaceChildren(
            this.createSideBarDiv(),
            this.createMainContentDiv()
        );
    }

    createSideBarDiv() {
        const sideBarDiv = document.createElement("div");
        sideBarDiv.classList.add("sidebar-wrapper");

        const sideBarTitle = document.createElement("div");
        sideBarDiv.classList.add("sidebar-title");
        sideBarTitle.textContent = "Projects";

        const sideBarUl = document.createElement("ul");
        sideBarUl.classList.add("sidebar-box");

        sideBarDiv.replaceChildren(sideBarTitle, sideBarUl);
        return sideBarDiv;
    }

    createMainContentDiv() {
        const mainContentWrapper = document.createElement("div");
        mainContentWrapper.classList.add("main-content-wrapper");

        const todoCardBox = document.createElement("div");
        todoCardBox.classList.add("todo-item-box");

        mainContentWrapper.appendChild(todoCardBox);

        return mainContentWrapper;
    }

    populateSidebar(projects) {
        const sidebarBox = document.querySelector(".sidebar-box");
        for (const project of projects) {
            const sideBarLi = document.createElement("li");
            sideBarLi.classList.add("sidebar-li");
            sideBarLi.textContent = project.projectName;
            sidebarBox.appendChild(sideBarLi);
        }
    }

    populateMainContent(activeProject) {
        const todoItemBox = document.querySelector(".todo-item-box");
        // Create todo card for each todo
        for (const [key, value] of activeProject.todoItems) {
            todoItemBox.appendChild(this.createTodoItemCard(value));
        }
    }

    createTodoItemCard(todoItem) {
        const newCard = document.createElement("div");
        newCard.classList.add("todo-item-card");

        const title = this.createTextDiv(todoItem.title, "todo-item-title");
        const desc = this.createTextDiv(todoItem.description, "todo-item-desc");
        const dueDate = this.createTextDiv(
            `Due: ${todoItem.dueDate}`,
            "todo-item-due"
        );
        const prio = this.createTextDiv(
            todoItem.priority,
            `todo-item-prio-${todoItem.priority.toLowerCase()}`
        );
        const notes = this.createTextDiv(todoItem.notes, "todo-item-notes");

        newCard.replaceChildren(title, desc, dueDate, prio, notes);
        return newCard;
    }

    createTextDiv(text, classList) {
        // Classlist works for both strings and array's of strings
        const newDiv = document.createElement("div");
        if (!(classList instanceof Array)) {
            classList = [classList];
        }
        newDiv.classList.add(...classList);
        newDiv.textContent = text;
        return newDiv;
    }
}

export default new HomePage();
