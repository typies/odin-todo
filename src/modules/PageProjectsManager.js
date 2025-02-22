class PageProjectsManager {
    constructor() {
        this.sharedProjectList = new Map(); // (projectName, List<TodoItem>)
        this.importProjectsFromLocal();
    }

    localStorageAdd(projectName) {
        localStorage.setItem(
            projectName,
            JSON.stringify(this.getProject(projectName))
        );
    }

    localStorageRemove(projectName) {
        localStorage.removeItem(projectName);
    }

    localStorageRefresh(projectName) {
        this.localStorageRemove(projectName);
        this.localStorageAdd(projectName);
    }

    importProjectsFromLocal() {
        for (let i = 0; i < window.localStorage.length; i++) {
            const projectName = window.localStorage.key(i);
            const todoItemsString = window.localStorage.getItem(projectName);
            this.addNewProject(projectName);
            this.addTodoItems(projectName, JSON.parse(todoItemsString));
        }
    }

    addNewProject(projectName) {
        if (!this.getProject(projectName)) {
            this.sharedProjectList.set(projectName, []);
            this.localStorageAdd(projectName);
            return true;
        }
        return false;
    }

    getProject(projectName) {
        return this.sharedProjectList.get(projectName);
    }

    updateProjectName(oldProjectName, newProjectName) {
        const existingTodoItems = this.getProject(oldProjectName);
        this.deleteProject(oldProjectName);
        this.addNewProject(newProjectName);
        this.addTodoItems(newProjectName, existingTodoItems);
    }

    deleteProject(projectName) {
        this.localStorageRemove(projectName);
        return this.sharedProjectList.delete(projectName);
    }

    addTodoItem(projectName, todoData) {
        const project = this.getProject(projectName);
        if (!project) return;
        const newTodoItem = new TodoItem(
            todoData.title,
            todoData.description,
            todoData.date,
            todoData.priority,
            todoData.notes,
            todoData.completed
        );
        project.push(newTodoItem);
        this.localStorageRefresh(projectName);
        return newTodoItem;
    }

    addTodoItems(projectName, todoDataList) {
        for (const todoData of todoDataList) {
            this.addTodoItem(projectName, todoData);
        }
    }

    getTodoItem(projectName, itemTitle) {
        const project = this.getProject(projectName);
        if (!project) return;
        return project.find((todoItem) => todoItem.title == itemTitle);
    }

    getTodoItemIndex(projectName, itemTitle) {
        const project = this.getProject(projectName);
        if (!project) return;
        return project.findIndex((todoItem) => todoItem.title == itemTitle);
    }

    replaceTodoItem(projectName, todoData) {
        const project = this.getProject(projectName);
        if (!project) return;
        const newTodoItem = new TodoItem(
            todoData.title,
            todoData.description,
            todoData.date,
            todoData.priority,
            todoData.notes,
            todoData.completed
        );
        const index = this.getTodoItemIndex(projectName, todoData.title);
        project.splice(index, 1, newTodoItem);
        this.localStorageRefresh(projectName);
        return newTodoItem;
    }

    removeTodoItem(projectName, itemTitle) {
        const project = this.getProject(projectName);
        if (!project) return;
        project.splice(this.getTodoItemIndex(projectName, itemTitle), 1);
        this.localStorageRefresh(projectName);
    }

    createTodoItemFromFormData(formData) {
        return new TodoItem(
            formData.get("title"),
            formData.get("description"),
            formData.get("date"),
            formData.get("priority"),
            formData.get("notes"),
            formData.get("completed") == "on"
        );
    }
}

class TodoItem {
    constructor(title, description, date, priority, notes, completed = false) {
        this.title = title;
        this.description = description;
        this.date = date;
        this.priority = priority;
        this.notes = notes;
        this.completed = completed;
    }
}

export default new PageProjectsManager();
