import mainPubSub from "./PubSub";

class TodoListModule {
    constructor() {
        mainPubSub.subscribe(
            "activeProjectChange",
            this.replaceMainContent.bind(this)
        );
    }

    replaceMainContent(project) {
        const todoItemBox = document.querySelector(".todo-item-box");
        todoItemBox.replaceChildren();
        // Create todo card for each todo
        for (const [key, value] of project.todoItems) {
            todoItemBox.appendChild(
                this.createTodoItemCard(project.projectName, value)
            );
        }
    }

    appendMainContent(projectName, todoItem) {
        const todoItemBox = document.querySelector(".todo-item-box");
        todoItemBox.appendChild(this.createTodoItemCard(projectName, todoItem));
    }

    createTodoListSkeleton() {
        const mainContentWrapper = document.createElement("div");
        mainContentWrapper.classList.add("main-content-wrapper");

        const todoCardBox = document.createElement("div");
        todoCardBox.classList.add("todo-item-box");

        const newTodoItemBtn = this.createNewTodoItemButton();

        mainContentWrapper.replaceChildren(todoCardBox, newTodoItemBtn);
        return mainContentWrapper;
    }

    createNewTodoItemButton() {
        const newBtn = document.createElement("button");
        newBtn.classList.add("new-todo-item-button");
        newBtn.textContent = "+";

        newBtn.addEventListener("click", () => {
            mainPubSub.publish("newTodoItemBtnPressed");
        });

        return newBtn;
    }

    createTodoItemCard(projectName, todoItem) {
        const newCard = document.createElement("div");
        newCard.classList.add("todo-item-card");

        const title = this.createTextDiv(todoItem.title, "todo-item-title");
        const dueDate = this.createTextDiv(
            `Due: ${todoItem.dueDate}`,
            "todo-item-due"
        );

        const desc = this.createHiddenTextDiv(todoItem.description);
        const prio = this.createHiddenTextDiv(todoItem.priority);
        const notes = this.createHiddenTextDiv(todoItem.notes);

        newCard.addEventListener("click", () => {
            for (const e of [desc, prio, notes]) {
                e.classList.toggle("hidden");
            }
        });

        newCard.replaceChildren(title, dueDate, desc, notes, prio);

        const wrapper = document.createElement("div");
        wrapper.classList.add("todo-item-card-wrapper");

        const completedTick = this.createCompletedTick();
        if (todoItem.completed) {
            completedTick.classList.add("ticked");
        }
        completedTick.addEventListener("click", () => {
            mainPubSub.publish("todoItemCompletionChange", {
                projectName,
                todoItem,
            });
            wrapper.replaceWith(this.createTodoItemCard(projectName, todoItem));
        });
        wrapper.replaceChildren(completedTick, newCard);

        return wrapper;
    }

    createTextDiv(text, classList = []) {
        // Classlist works for both strings and array's of strings
        const newDiv = document.createElement("div");
        if (!(classList instanceof Array)) {
            classList = [classList];
        }
        newDiv.classList.add(...classList);
        newDiv.textContent = text;
        return newDiv;
    }

    createHiddenTextDiv(text, classList = []) {
        classList.push("hidden");
        return this.createTextDiv(text, classList);
    }

    createCompletedTick() {
        const completedTick = document.createElement("div");
        completedTick.classList.add("completed-tick");

        completedTick.addEventListener("click", () => {
            completedTick.classList.toggle("ticked");
        });

        return completedTick;
    }
}

export default new TodoListModule();
