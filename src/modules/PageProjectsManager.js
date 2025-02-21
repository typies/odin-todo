class PageProjectsManager {
    constructor() {
        this.sharedProjectList = new Map(); // (projectName, List<TodoItem>)
    }

    addNewProject(projectName) {
        this.sharedProjectList.set(projectName, []);
    }

    getProject(projectName) {
        return this.sharedProjectList.get(projectName);
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
