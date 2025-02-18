import TodoItem from "./TodoItem.js";

class Project {
    constructor(projectName) {
        this.projectName = projectName;
        this.todoItems = new Map(); // (title, TodoItem) pairs
    }

    addTodoItem(todoItem) {
        // No items in project may have the same title
        if (this.todoItems.get(todoItem.title)) {
            console.warn(
                `addTodoItem skipped. Item with title ${todoItem.title} already exists within this project`
            );
            return false;
        }
        const newTodoItem = new TodoItem(
            todoItem.title,
            todoItem.description,
            todoItem.dueDate,
            todoItem.priority,
            todoItem.notes,
            todoItem.checkList
        );
        this.todoItems.set(newTodoItem.title, newTodoItem);
        return true;
    }

    addTodoItems(...todoItems) {
        // Accepts 1 or multiple todoItems, as well as a list of todoItems
        for (const todoItem of todoItems.flat()) {
            this.addTodoItem(todoItem);
        }
    }

    removeTodoItem(title) {
        return this.todoItems.delete(title);
    }

    toggleTodoItemStatus(title) {
        const completedStatus = this.todoItems.get(title).completed;
        this.todoItems.get(title).completed = !completedStatus;
    }
}

export default Project;
