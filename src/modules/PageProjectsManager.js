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
            todoData.dueDate,
            todoData.priority,
            todoData.notes,
            todoData.checklist,
            todoData.completed
        );
        const project = this.getProject(projectName);
        project.push(newTodoItem);
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
}

class TodoItem {
    constructor(title, description, dueDate, priority, notes, checkList) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.notes = notes;
        this.checkList = checkList;
        this.completed = false;
    }
}

export default new PageProjectsManager();
