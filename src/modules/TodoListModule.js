import PageProjectsManager from "./PageProjectsManager";
import mainPubSub from "./PubSub";

class TodoListModule {
    constructor() {
        mainPubSub.subscribe(
            "activeProjectChange",
            this.replaceMainContent.bind(this)
        );
    }

    replaceMainContent(projectName) {
        const todoItemBox = document.querySelector(".todo-item-box");
        todoItemBox.replaceChildren();
        // Create todo card for each todo
        for (const todoItems of PageProjectsManager.getProject(projectName)) {
            todoItemBox.appendChild(
                this.createTodoItemCard(projectName, todoItems)
            );
        }
    }

    appendLatestToMainContent(projectName) {
        const todoItemBox = document.querySelector(".todo-item-box");
        todoItemBox.appendChild(
            this.createTodoItemCard(
                projectName,
                PageProjectsManager.getProject(projectName).slice(-1)[0]
            )
        );
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
        const wrapper = document.createElement("div");
        wrapper.classList.add("todo-item-card-wrapper");

        const newCard = document.createElement("div");
        newCard.classList.add("todo-item-card");

        const title = this.createTextDiv(todoItem.title, "todo-item-title");
        const dueDate = this.createTextDiv(
            `Due: ${todoItem.dueDate}`,
            "todo-item-due"
        );

        const desc = this.createHiddenTextDiv(todoItem.description);
        const prio = this.createHiddenTextDiv(todoItem.priority, [
            `prio-${todoItem.priority.toLowerCase()}`,
        ]);
        const notes = this.createHiddenTextDiv(todoItem.notes);

        newCard.addEventListener("click", () => {
            for (const e of [desc, prio, notes]) {
                e.classList.toggle("hidden");
            }
        });

        newCard.replaceChildren(title, dueDate, desc, notes, prio);

        const completedTick = this.createCompletedTick();
        if (todoItem.completed) {
            completedTick.classList.add("ticked");
        }
        completedTick.addEventListener("click", () => {
            const temp = PageProjectsManager.getTodoItem(
                projectName,
                todoItem.title
            );
            temp.completed = !todoItem.completed;
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
