import mainPubSub from "./PubSub";

class SidebarModule {
    constructor() {
        mainPubSub.subscribe("activeProjectChange", this.changeActiveProject);
    }

    changeActiveProject(project) {
        const sidebarLis = document.querySelectorAll(".sidebar-li");
        const highlightedElement = document.querySelector(
            ".sidebar-li.highlighted"
        );
        if (highlightedElement)
            highlightedElement.classList.remove("highlighted");
        const temp = Array.from(sidebarLis).filter(
            (li) => li.textContent == project.projectName
        );

        temp[0].classList.add("highlighted");
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

            // Mouse over
            if (sidebarLi.textContent.length > 28) {
                const fullText = sidebarLi.textContent;
                const shortText =
                    sidebarLi.textContent.substring(0, 22) + "...";
                sidebarLi.addEventListener("mouseenter", () => {
                    sidebarLi.textContent = fullText;
                });
                sidebarLi.addEventListener("mouseleave", () => {
                    sidebarLi.textContent = shortText;
                });
                sidebarLi.textContent = shortText;
            }

            sidebarLi.addEventListener("click", () => {
                mainPubSub.publish("activeProjectChange", project);
            });
            sidebarBox.appendChild(sidebarLi);
        }
    }
}

export default new SidebarModule();
