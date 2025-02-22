import { format, endOfDay } from "date-fns";

export default class PopUpFormFactory {
    static createNewPopUp(popUpTitle, newForm) {
        const popUpFormContainer = document.createElement("div");
        popUpFormContainer.classList.add("pop-up-bg");

        const popUpBoxDiv = document.createElement("div");
        popUpBoxDiv.classList.add("pop-up-box");

        const popUpTitleDiv = document.createElement("div");
        popUpTitleDiv.classList.add("pop-up-title");
        popUpTitleDiv.textContent = popUpTitle;

        popUpBoxDiv.appendChild(popUpTitleDiv);
        popUpFormContainer.appendChild(popUpBoxDiv);

        const cancelBtn = newForm.querySelector(
            'input[type="button"][value="Cancel"]'
        );
        cancelBtn.addEventListener("click", () => popUpFormContainer.remove());

        popUpBoxDiv.appendChild(newForm);

        return popUpFormContainer;
    }

    static createNewProjectPopUp() {
        return this.createNewPopUp("New Project", this.createNewProjectForm());
    }

    static createEditProjectPopUp(currentProjectName) {
        return this.createNewPopUp(
            "Change Project Name",
            this.createNewProjectForm(currentProjectName)
        );
    }

    static createNewTodoItemPopUp() {
        return this.createNewPopUp(
            "Create New Todo Item",
            this.createNewTodoItemForm()
        );
    }

    static createEditTodoItemPopUp(existingTodoItem) {
        return this.createNewPopUp(
            "Edit Todo Item",
            this.createNewTodoItemForm(existingTodoItem)
        );
    }

    static createNewForm(listOfFormInputs) {
        const form = document.createElement("form");
        form.classList.add("form-container");

        for (const formInput of listOfFormInputs) {
            form.append(formInput.createFormItem());
        }

        const btnGroup = document.createElement("div");
        btnGroup.classList.add("form-btn-group");

        const cancelBtn = document.createElement("input");
        cancelBtn.setAttribute("type", "button");
        cancelBtn.setAttribute("value", "Cancel");

        const submitBtn = document.createElement("input");
        submitBtn.setAttribute("type", "submit");
        submitBtn.setAttribute("value", "Create");
        submitBtn.textContent = "Submit";

        btnGroup.appendChild(cancelBtn);
        btnGroup.appendChild(submitBtn);
        form.appendChild(btnGroup);

        return form;
    }

    static createNewProjectForm(currentProjectName = "") {
        return this.createNewForm([
            new TextFormItem({
                labelText: "Project Name",
                id: "project-name",
                name: "project-name",
                required: true,
                value: currentProjectName,
            }),
        ]);
    }

    static createNewTodoItemForm(existingValues = {}) {
        const formattedToday = format(new Date(), "yyyy-MM-dd");
        return this.createNewForm([
            new TextFormItem({
                labelText: "Todo Title",
                id: "todo-title",
                name: "title",
                required: true,
                value: existingValues.title,
            }),
            new TextFormItem({
                labelText: "Description",
                id: "description",
                name: "description",
                required: false,
                value: existingValues.description,
            }),
            new DateFormItem({
                labelText: "Due Date",
                id: "due-date",
                name: "date",
                required: true,
                value: existingValues.date || formattedToday,
            }),
            new RadioFormItemWrapper("Priority", [
                new RadioFormItem({
                    labelText: "Low",
                    id: "low-priority",
                    name: "priority",
                    value: "Low",
                    required: false,
                    checked: existingValues.priority == "Low",
                }),
                new RadioFormItem({
                    labelText: "Medium",
                    id: "med-priority",
                    name: "priority",
                    value: "Medium",
                    required: false,
                    checked: existingValues.priority == "Medium",
                }),
                new RadioFormItem({
                    labelText: "High",
                    id: "high-priority",
                    name: "priority",
                    value: "High",
                    required: false,
                    checked: existingValues.priority == "High",
                }),
            ]),
            new CheckboxFormItem({
                labelText: "Completed?",
                id: "completed",
                name: "completed",
                required: false,
                checked: existingValues.completed,
            }),
        ]);
    }
}

class FormItem {
    constructor(itemData) {
        this.labelText = itemData.labelText;
        this.id = itemData.id;
        this.name = itemData.name;
        this.required = itemData.required || false;
        this.value = itemData.value;
    }

    createFormItemSkeleton() {
        const itemWrapper = document.createElement("div");
        itemWrapper.classList.add("form-item-wrapper");

        const fieldLabel = document.createElement("label");
        fieldLabel.textContent = this.labelText;
        fieldLabel.setAttribute("for", this.id);

        itemWrapper.appendChild(fieldLabel);
        return itemWrapper;
    }

    createFormItem() {
        const itemWrapper = this.createFormItemSkeleton();

        const fieldInput = document.createElement(this.htmlElementType);
        fieldInput.setAttribute("id", this.id);
        fieldInput.setAttribute("name", this.name);
        fieldInput.setAttribute("type", this.type);
        if (this.placeholder)
            fieldInput.setAttribute("placeholder", this.placeholder);
        if (this.required) fieldInput.setAttribute("required", true);
        if (this.value) fieldInput.setAttribute("value", this.value);
        if (this.checked) fieldInput.checked = true;

        itemWrapper.appendChild(fieldInput);
        return itemWrapper;
    }
}

class TextFormItem extends FormItem {
    constructor(itemData) {
        super(itemData);
        this.htmlElementType = "input";
        this.type = "text";
        this.placeholder = itemData.placeholder;
    }
}

class CheckboxFormItem extends FormItem {
    constructor(itemData) {
        super(itemData);
        this.htmlElementType = "input";
        this.type = "checkbox";
        this.placeholder = itemData.placeholder;
        this.checked = itemData.checked;
    }
}

class DateFormItem extends FormItem {
    constructor(itemData) {
        super(itemData);
        this.htmlElementType = "input";
        this.type = "date";
        this.placeholder = itemData.placeholder;
    }
}

class RadioFormItem extends FormItem {
    constructor(itemData) {
        super(itemData);
        this.htmlElementType = "input";
        this.type = "radio";
        this.placeholder = itemData.placeholder;
        this.value = itemData.value;
        this.checked = itemData.checked;
    }
}

class RadioFormItemWrapper {
    constructor(wrapperName, listOfRadioFormItems) {
        this.wrapperName = wrapperName;
        this.radioFormItems = listOfRadioFormItems;
    }

    createFormItemSkeleton() {
        const itemWrapper = document.createElement("div");
        itemWrapper.classList.add("form-item-wrapper");

        const radioGroupTitle = document.createElement("div");
        radioGroupTitle.classList.add("radio-group-title");
        radioGroupTitle.textContent = this.wrapperName;

        itemWrapper.appendChild(radioGroupTitle);
        return itemWrapper;
    }

    createFormItem() {
        const itemWrapper = this.createFormItemSkeleton();

        for (const radioFormItem of this.radioFormItems) {
            itemWrapper.appendChild(radioFormItem.createFormItem());
        }

        return itemWrapper;
    }
}
