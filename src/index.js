import "./styles/main.css";
import HomePage from "./modules/HomePage.js";
import PageProjectsManager from "./modules/PageProjectsManager.js";

const defaultHouseCareList = [
    {
        title: "Clean Gutters",
        description: "Clean out the gutters around the house",
        date: "2025-02-21",
        priority: "Low",
        checkList: ["Upper gutters", "Lower gutters"],
    },
    {
        title: "Mow Lawn",
        description: "Mow the front and back lawn. Don't forget edgework",
        date: "2026-02-24",
        priority: "Medium",
        checkList: ["Upper gutters", "Lower gutters"],
        notes: "Batteries will need to be charged ahead of time",
        checkList: [
            "Charge Batteries",
            "Mow Front",
            "Edge Front",
            "Mow Back",
            "Edge Back",
            "De-weed garden bed",
        ],
    },
];

const defaultShoppingList = [
    {
        title: "Marianna",
        description: "Shop for Marianna",
        date: "2025-12-20",
        priority: "High",
    },
];

PageProjectsManager.addNewProject("House Care");
PageProjectsManager.addTodoItems("House Care", defaultHouseCareList);

PageProjectsManager.addNewProject("Holiday Shopping project long name");
PageProjectsManager.addTodoItems(
    "Holiday Shopping project long name",
    defaultShoppingList
);
HomePage.render();
