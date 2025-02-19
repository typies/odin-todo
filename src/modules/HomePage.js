import SidebarModule from "./SidebarModule";
import mainPubSub from "./PubSub";
import TodoListModule from "./TodoListModule";

class HomePage {
    constructor() {
        this.projects = [];
        mainPubSub.subscribe(
            "todoItemCompleteChange",
            this.updateTodoItem.bind(this)
        );
    }
    domElements = {
        content: document.querySelector("#content"),
    };

    updateTodoItem(data) {
        const matchingProject = this.projects.find(
            (project) => project.projectName == data.projectName
        );

        matchingProject.todoItems.set(data.todoItem.title, data.todoItem);
        mainPubSub.publish("todoItemRefresh", data);
    }

    render() {
        this.domElements.content.replaceChildren(
            SidebarModule.createSidebarSkeleton(),
            TodoListModule.createTodoListSkeleton()
        );
        SidebarModule.populateSidebar(this.projects);

        mainPubSub.publish("activeProjectChange", this.projects[0]);
    }
}

export default new HomePage();
