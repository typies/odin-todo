import SidebarModule from "./SidebarModule";
import mainPubSub from "./PubSub";
import TodoListModule from "./TodoListModule";

class HomePage {
    constructor() {
        this.projects = [];
        mainPubSub.subscribe(
            "todoItemCompletionChange",
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

        matchingProject.toggleTodoItemStatus(data.todoItem.title);
    }

    render() {
        this.domElements.content.replaceChildren(
            SidebarModule.createSidebarSkeleton(),
            TodoListModule.createTodoListSkeleton()
        );
        SidebarModule.populateSidebar(this.projects);
    }
}

export default new HomePage();
