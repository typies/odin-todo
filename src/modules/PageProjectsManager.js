class PageProjectsManager {
    constructor() {
        this.sharedProjectList = new Map(); // (projectName, List<TodoItem>)
    }

    addNewProject(projectName) {
        if (!this.sharedProjectList.get(projectName)) {
            this.sharedProjectList.set(projectName, []);
            return true;
        }
        return false;
    }

    updateProjectName(oldProjectName, newProjectName) {
        const existingTodoItems = this.getProject(oldProjectName);
        this.sharedProjectList.delete(oldProjectName);
        this.addNewProject(newProjectName);
        this.addTodoItems(newProjectName, existingTodoItems);
    }

    getProject(projectName) {
        return this.sharedProjectList.get(projectName);
    }

    deleteProject(projectName) {
        return this.sharedProjectList.delete(projectName);
    }

    addTodoItem(projectName, todoData) {
        const newTodoItem = new TodoItem(
            todoData.title,
            todoData.description,
            todoData.date,
            todoData.priority,
            todoData.notes,
            todoData.checklist,
            todoData.completed
        );
        const project = this.getProject(projectName);
        project.push(newTodoItem);
        return newTodoItem;
    }

    replaceTodoItem(projectName, todoData) {
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
        const project = this.getProject(projectName);
        project.splice(index, 1, newTodoItem);
        return newTodoItem;
    }

    addTodoItems(projectName, todoDataList) {
        for (const todoData of todoDataList) {
            this.addTodoItem(projectName, todoData);
        }
    }

    getTodoItem(projectName, itemTitle) {
        return this.sharedProjectList
            .get(projectName)
            .find((todoItem) => todoItem.title == itemTitle);
    }

    getTodoItemIndex(projectName, itemTitle) {
        return this.sharedProjectList
            .get(projectName)
            .findIndex((todoItem) => todoItem.title == itemTitle);
    }

    removeTodoItem(projectName, itemTitle) {
        this.sharedProjectList
            .get(projectName)
            .splice(this.getTodoItemIndex(projectName, itemTitle), 1);
    }
}

class TodoItem {
    constructor(
        title,
        description,
        date,
        priority,
        notes,
        checkList,
        completed = false
    ) {
        this.title = title;
        this.description = description;
        this.date = date;
        this.priority = priority;
        this.notes = notes;
        this.checkList = checkList;
        this.completed = completed;
    }
}

export default new PageProjectsManager();
