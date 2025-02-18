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

export default TodoItem;
