import PageProjectsManager from "./PageProjectsManager";
import mainPubSub from "./PubSub";
import pencil from "../images/pencil.svg";

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

    replaceTodoInMainContent(projectName, index, newTodoItem) {
        const todoItemBox = document.querySelector(".todo-item-box");
        const newCard = this.createTodoItemCard(projectName, newTodoItem);
        todoItemBox.replaceChild(newCard, todoItemBox.childNodes[index]);
    }

    insertLatestToMainContent(projectName, index) {
        const todoItemBox = document.querySelector(".todo-item-box");
        const newCard = this.createTodoItemCard(
            projectName,
            PageProjectsManager.getProject(projectName).slice(-1)[0]
        );
        index
            ? todoItemBox.insertBefore(index)
            : todoItemBox.appendChild(newCard);
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
        const date = this.createTextDiv(
            `Due: ${todoItem.date}`,
            "todo-item-due"
        );

        const desc = this.createHiddenTextDiv(todoItem.description);
        const prio = this.createHiddenTextDiv(todoItem.priority, [
            `prio-${todoItem.priority}`,
        ]);
        const notes = this.createHiddenTextDiv(todoItem.notes);

        const editButton = document.createElement("img");
        editButton.classList.add("hidden");
        editButton.src = pencil;
        editButton.addEventListener("click", () => {
            mainPubSub.publish("editButtonPressed", {
                projectName,
                todoItem,
                wrapper,
            });
        });

        newCard.addEventListener("click", () => {
            for (const e of [desc, prio, notes, editButton]) {
                e.classList.toggle("hidden");
            }
        });

        newCard.replaceChildren(title, date, desc, notes, prio, editButton);

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
