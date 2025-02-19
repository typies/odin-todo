import SidebarModule from "./SidebarModule";
import mainPubSub from "./PubSub";
import TodoListModule from "./TodoListModule";

class HomePage {
    constructor() {
        this.projects = [];
    }
    domElements = {
        content: document.querySelector("#content"),
    };

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
