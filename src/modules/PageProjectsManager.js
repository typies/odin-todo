class PageProjectsManager {
    constructor() {
        this.sharedProjectList = new Map(); // (projectName, List<TodoItem>)
    }

    addNewProject(projectName) {
        if (!this.getProject(projectName)) {
            this.sharedProjectList.set(projectName, []);
            return true;
        }
        return false;
    }

    getProject(projectName) {
        return this.sharedProjectList.get(projectName);
    }

    updateProjectName(oldProjectName, newProjectName) {
        const existingTodoItems = this.getProject(oldProjectName);
        this.sharedProjectList.delete(oldProjectName);
        this.addNewProject(newProjectName);
        this.addTodoItems(newProjectName, existingTodoItems);
    }

    deleteProject(projectName) {
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
            todoData.checklist,
            todoData.completed
        );
        project.push(newTodoItem);
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
            todoData.checklist,
            todoData.completed
        );
        const index = this.getTodoItemIndex(projectName, todoData.title);
        project.splice(index, 1, newTodoItem);
        return newTodoItem;
    }

    removeTodoItem(projectName, itemTitle) {
        const project = this.getProject(projectName);
        if (!project) return;
        project.splice(this.getTodoItemIndex(projectName, itemTitle), 1);
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
