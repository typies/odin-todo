import PageProjectsManager from "./PageProjectsManager";
import mainPubSub from "./PubSub";
import pencilSvg from "../images/pencil.svg";
import trashSvg from "../images/trash.svg";
import {
    differenceInDays,
    endOfDay,
    formatDistanceToNow,
    parseISO,
} from "date-fns";

class TodoListModule {
    constructor() {}

    addTodoItem(projectName, todoItem, index = false) {
        const todoItemBox = document.querySelector(".todo-item-box");
        const newCard = this.createTodoItemCard(projectName, todoItem);
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

        const dueDate = endOfDay(parseISO(todoItem.date));
        const dateText = formatDistanceToNow(dueDate, {
            addSuffix: true,
        });
        const diffInDays = differenceInDays(dueDate, new Date());
        const date = this.createTextDiv(`Due: ${dateText}`, "todo-item-due");
        if (diffInDays < 1) date.classList.add("urgent-date");

        const desc = this.createHiddenTextDiv(todoItem.description);
        const prio = this.createHiddenTextDiv(todoItem.priority, [
            `prio-${todoItem.priority}`,
        ]);
        const notes = this.createHiddenTextDiv(todoItem.notes);

        const btnDiv = document.createElement("div");
        btnDiv.classList.add(...["todo-item-btn-div", "hidden"]);

        const editButton = document.createElement("img");
        editButton.src = pencilSvg;
        editButton.addEventListener("click", () => {
            mainPubSub.publish("editTodoButtonPressed", {
                todoItem,
                wrapper,
            });
        });

        const deleteButton = document.createElement("img");
        deleteButton.src = trashSvg;
        deleteButton.classList.add("delete-svg");
        deleteButton.addEventListener("click", () => {
            PageProjectsManager.removeTodoItem(projectName, todoItem.title);
            wrapper.remove();
        });

        btnDiv.replaceChildren(deleteButton, editButton);

        newCard.addEventListener("click", () => {
            for (const e of [desc, prio, notes, btnDiv]) {
                e.classList.toggle("hidden");
            }
        });

        newCard.replaceChildren(title, date, desc, notes, prio, btnDiv);

        const completedTick = this.createCompletedTick();
        if (todoItem.completed) {
            completedTick.classList.add("ticked");
        }
        completedTick.addEventListener("click", () => {
            PageProjectsManager.replaceTodoItem(projectName, {
                ...todoItem,
                completed: !todoItem.completed,
            });
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

    replaceMainContent(projectName, todoItems) {
        const todoItemBox = document.querySelector(".todo-item-box");
        todoItemBox.replaceChildren();
        if (!projectName || !todoItems) return;
        // Create todo card for each todo

        for (const todoItem of todoItems) {
            todoItemBox.appendChild(
                this.createTodoItemCard(projectName, todoItem)
            );
        }
    }

    replaceTodoInMainContent(projectName, index, newTodoItem) {
        const todoItemBox = document.querySelector(".todo-item-box");
        const newCard = this.createTodoItemCard(projectName, newTodoItem);
        todoItemBox.replaceChild(newCard, todoItemBox.childNodes[index]);
    }
}

export default new TodoListModule();
