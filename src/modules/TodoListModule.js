import mainPubSub from "./PubSub";

class TodoListModule {
    constructor() {
        mainPubSub.subscribe(
            "activeProjectChange",
            this.replaceMainContent.bind(this)
        );
        mainPubSub.subscribe(
            "todoItemRefresh",
            this.refreshTodoItem.bind(this)
        );
    }

    refreshTodoItem(data) {
        const itemToReplace = document.querySelector(
            `[data-title='${data.todoItem.title}']`
        );

        itemToReplace.replaceWith(
            this.createTodoItemCard(data.projectName, data.todoItem)
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

    createTodoListSkeleton() {
        const mainContentWrapper = document.createElement("div");
        mainContentWrapper.classList.add("main-content-wrapper");

        const todoCardBox = document.createElement("div");
        todoCardBox.classList.add("todo-item-box");

        mainContentWrapper.appendChild(todoCardBox);

        return mainContentWrapper;
    }

    createTodoItemCard(projectName, todoItem) {
        const newCard = document.createElement("div");
        newCard.classList.add("todo-item-card");

        const title = this.createTextDiv(todoItem.title, "todo-item-title");
        const dueDate = this.createTextDiv(
            `Due: ${todoItem.dueDate}`,
            "todo-item-due"
        );

        const desc = this.createTextDiv(todoItem.description, [
            "todo-item-desc",
            "hidden",
        ]);
        const prio = this.createTextDiv(todoItem.priority, [
            `todo-item-prio-${todoItem.priority.toLowerCase()}`,
            "hidden",
        ]);
        const notes = this.createTextDiv(todoItem.notes, [
            "todo-item-notes",
            "hidden",
        ]);

        newCard.addEventListener("click", () =>
            this.toggleHiddenChildren(newCard)
        );

        newCard.replaceChildren(title, dueDate, desc, notes, prio);

        const wrapper = document.createElement("div");
        wrapper.classList.add("todo-item-card-wrapper");
        wrapper.setAttribute("data-title", todoItem.title);

        const completedTick = this.createCompletedTick();
        if (todoItem.completed) {
            completedTick.classList.add("ticked");
        }
        completedTick.addEventListener("click", () => {
            todoItem.completed = !todoItem.completed;
            mainPubSub.publish("todoItemCompleteChange", {
                projectName,
                todoItem,
            });
        });
        wrapper.replaceChildren(completedTick, newCard);

        return wrapper;
    }

    toggleHiddenChildren(element) {
        const hidden = element.querySelectorAll(".hidden");
        const unhidden = element.querySelectorAll(".unhidden");
        for (const hiddenEle of hidden) {
            // Show hidden elements
            hiddenEle.classList.remove("hidden");
            hiddenEle.classList.add("unhidden");
        }
        for (const unhiddenEle of unhidden) {
            unhiddenEle.classList.remove("unhidden");
            unhiddenEle.classList.add("hidden");
        }
    }

    createTextDiv(text, classList) {
        // Classlist works for both strings and array's of strings
        const newDiv = document.createElement("div");
        if (!(classList instanceof Array)) {
            classList = [classList];
        }
        newDiv.classList.add(...classList);
        newDiv.textContent = text;
        return newDiv;
    }

    createCompletedTick() {
        const completedTick = document.createElement("div");
        completedTick.classList.add("completed-tick");

        completedTick.addEventListener("click", () => {
            if (completedTick.classList.contains("ticked")) {
                completedTick.classList.remove("ticked");
                return false;
            } else {
                completedTick.classList.add("ticked");
                return true;
            }
        });

        return completedTick;
    }
}

export default new TodoListModule();
