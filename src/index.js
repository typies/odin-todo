import "./styles/main.css";
import Project from "./modules/Project.js";
import HomePage from "./modules/HomePage.js";

const defaultHouseCareList = [
    {
        title: "Clean Gutters",
        description: "Clean out the gutters around the house",
        dueDate: "Monday",
        priority: "Low",
        checkList: ["Upper gutters", "Lower gutters"],
    },
    {
        title: "Mow Lawn",
        description: "Mow the front and back lawn. Don't forget edgework",
        dueDate: "Sunday",
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
        dueDate: "Christmas",
        priority: "High",
    },
];

const defaultProject = new Project("House care");

defaultProject.addTodoItems(defaultHouseCareList);

defaultProject.toggleTodoItemStatus("Clean Gutters");

const defaultSecondProject = new Project("Holiday shopping project long name");

defaultSecondProject.addTodoItems(defaultShoppingList);

HomePage.projects.push(defaultProject);
HomePage.projects.push(defaultSecondProject);
HomePage.render();
