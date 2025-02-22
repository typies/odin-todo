import PageProjectsManager from "./PageProjectsManager";
import mainPubSub from "./PubSub";
import trashSvg from "../images/trash.svg";
import pencilSvg from "../images/pencil.svg";

class SidebarModule {
    constructor() {
        mainPubSub.subscribe(
            "activeProjectChange",
            this.changeActiveProject.bind(this)
        );
    }

    changeActiveProject(projectName) {
        const sidebarLiTexts = document.querySelectorAll(".sidebar-li-text");
        const highlightedElement = document.querySelector(
            ".sidebar-li-text.highlighted"
        );
        if (highlightedElement)
            highlightedElement.classList.remove("highlighted");
        const newActiveLi = Array.from(sidebarLiTexts).find(
            (div) => div.textContent == projectName
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

    replaceSidebarItem(oldProjectName, newProjectName) {
        const sidebarLiTexts = document.querySelectorAll(".sidebar-li-text");
        const liToReplace = Array.from(sidebarLiTexts).find(
            (div) => div.textContent == oldProjectName
        ).parentNode;
        const newSidebarItem = this.createNewSidebarItem(newProjectName);
        liToReplace.parentNode.replaceChild(newSidebarItem, liToReplace);
    }

    addNewSidebarItem(projectName) {
        const sidebarBox = document.querySelector(".sidebar-box");
        const newSidebarItem = this.createNewSidebarItem(projectName);
        sidebarBox.appendChild(newSidebarItem);
    }

    createNewSidebarItem(projectName) {
        const sidebarLi = document.createElement("li");
        sidebarLi.classList.add("sidebar-li");

        const sidebarLiButtonDiv = document.createElement("div");
        sidebarLiButtonDiv.classList.add(...["sidebar-btn-div", "hidden"]);

        const sidebarDelete = document.createElement("img");
        sidebarDelete.classList.add("delete-svg");
        sidebarDelete.src = trashSvg;
        sidebarDelete.addEventListener("click", () => {
            PageProjectsManager.deleteProject(projectName);
            mainPubSub.publish("deletedProject", projectName);
            sidebarLi.remove();
        });

        const sidebarEdit = document.createElement("img");
        sidebarEdit.src = pencilSvg;
        sidebarEdit.addEventListener("click", () => {
            mainPubSub.publish("editProjectBtnPressed", projectName);
        });

        sidebarLiButtonDiv.replaceChildren(sidebarDelete, sidebarEdit);
        sidebarLi.addEventListener("mouseenter", () => {
            sidebarLiButtonDiv.classList.remove("hidden");
        });
        sidebarLi.addEventListener("mouseleave", () => {
            sidebarLiButtonDiv.classList.add("hidden");
        });

        const sidebarLiText = document.createElement("div");
        sidebarLiText.classList.add("sidebar-li-text");
        sidebarLiText.textContent = projectName;

        sidebarLi.replaceChildren(sidebarLiButtonDiv, sidebarLiText);

        sidebarLiText.addEventListener("click", () => {
            mainPubSub.publish("activeProjectChange", projectName);
        });
        return sidebarLi;
    }
}

export default new SidebarModule();
