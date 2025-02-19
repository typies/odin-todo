import mainPubSub from "./PubSub";

class SidebarModule {
    constructor() {}

    changeActiveProject(project) {
        const sidebarLis = document.querySelectorAll(".sidebar-li");
        const highlightedElement = document.querySelector(
            ".sidebar-li.highlighted"
        );
        if (highlightedElement)
            highlightedElement.classList.remove("highlighted");
        const newActiveLi = Array.from(sidebarLis).find(
            (li) => li.textContent == project.projectName
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

        wrapperDiv.replaceChildren(sidebarTitle, sidebarList);
        return wrapperDiv;
    }

    populateSidebar(projects) {
        const sidebarBox = document.querySelector(".sidebar-box");
        for (const project of projects) {
            const sidebarLi = document.createElement("li");
            sidebarLi.classList.add("sidebar-li");
            sidebarLi.textContent = project.projectName;

            sidebarLi.addEventListener("click", () => {
                mainPubSub.publish("activeProjectChange", project);
                this.changeActiveProject(project);
            });
            sidebarBox.appendChild(sidebarLi);
        }
    }
}

export default new SidebarModule();
