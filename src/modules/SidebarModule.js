import PageProjectsManager from "./PageProjectsManager";
import mainPubSub from "./PubSub";

class SidebarModule {
    constructor() {
        mainPubSub.subscribe(
            "activeProjectChange",
            this.changeActiveProject.bind(this)
        );
    }

    changeActiveProject(projectName) {
        const sidebarLis = document.querySelectorAll(".sidebar-li");
        const highlightedElement = document.querySelector(
            ".sidebar-li.highlighted"
        );
        if (highlightedElement)
            highlightedElement.classList.remove("highlighted");
        const newActiveLi = Array.from(sidebarLis).find(
            (li) => li.textContent == projectName
        );

        newActiveLi.classList.add("highlighted");
    }

    createSidebarSkeleton() {
        const wrapperDiv = document.createElement("div");
        wrapperDiv.classList.add("sidebar-wrapper");

        const sidebarTitle = document.createElement("div");
        sidebarTitle.classList.add("sidebar-title");
        sidebarTitle.textContent = "Projects";

        const sidebarList = document.createElement("ul");
        sidebarList.classList.add("sidebar-box");

        const newProjectButton = this.createNewProjectButton();

        wrapperDiv.replaceChildren(sidebarTitle, sidebarList, newProjectButton);
        return wrapperDiv;
    }

    createNewProjectButton() {
        const newBtn = document.createElement("button");
        newBtn.classList.add("new-project-button");
        newBtn.textContent = "+";

        newBtn.addEventListener("click", () => {
            mainPubSub.publish("newProjectBtnPressed");
        });

        return newBtn;
    }

    populateSidebar() {
        for (const projectName of PageProjectsManager.sharedProjectList.keys()) {
            this.addNewSidebarItem(projectName);
        }
    }

    addNewSidebarItem(projectName) {
        const sidebarBox = document.querySelector(".sidebar-box");
        const sidebarLi = document.createElement("li");
        sidebarLi.classList.add("sidebar-li");
        sidebarLi.textContent = projectName;

        sidebarLi.addEventListener("click", () => {
            mainPubSub.publish("activeProjectChange", projectName);
        });
        sidebarBox.appendChild(sidebarLi);
    }
}

export default new SidebarModule();
