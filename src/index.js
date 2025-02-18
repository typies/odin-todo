import "./styles/main.css";
import Project from "./modules/Project.js";
import HomePage from "./modules/HomePage.js";

const defaultTodoList = [
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

const defaultProject = new Project("House care");

defaultProject.addTodoItems(defaultTodoList);

defaultProject.toggleTodoItemStatus("Clean Gutters");

const defaultSecond = new Project("Holiday shopping project long name");

HomePage.projects.push(defaultProject);
HomePage.projects.push(defaultSecond);
HomePage.render();
