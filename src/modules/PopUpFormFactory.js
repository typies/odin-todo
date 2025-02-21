export default class PopUpFormFactory {
    static createPopUp(title, formInputs) {
        const popUpFormContainer = this.createPopUpSkeleton(title);
        const newForm = this.createForm(formInputs);

        const cancelBtn = newForm.querySelector(
            'input[type="button"][value="Cancel"]'
        );
        cancelBtn.addEventListener("click", () => popUpFormContainer.remove());

        popUpFormContainer.querySelector(".pop-up-box").appendChild(newForm);

        return popUpFormContainer;
    }

    static createPopUpSkeleton(title) {
        const popUpFormContainer = document.createElement("div");
        popUpFormContainer.classList.add("pop-up-bg");

        const popUpBox = document.createElement("div");
        popUpBox.classList.add("pop-up-box");

        const popUpTitle = document.createElement("div");
        popUpTitle.classList.add("pop-up-title");
        popUpTitle.textContent = title;

        popUpBox.appendChild(popUpTitle);
        popUpFormContainer.appendChild(popUpBox);

        return popUpFormContainer;
    }

    static createForm(formInputs) {
        const form = document.createElement("form");
        form.classList.add("form-container");
        for (const field of formInputs) {
            const fieldLabel = document.createElement("label");
            fieldLabel.textContent = field.labelText;
            if (field.id) fieldLabel.setAttribute("for", field.id);

            const fieldInput = document.createElement(field.elementType);
            if (field.type) fieldInput.setAttribute("type", field.type);
            if (field.id) fieldInput.setAttribute("id", field.id);
            if (field.class) fieldInput.classList.add(field.class);
            if (field.placeholder)
                fieldInput.setAttribute("placeholder", field.placeholder);
            if (field.name) fieldInput.setAttribute("name", field.name);
            if (field.required) fieldInput.setAttribute("required", true);

            form.appendChild(fieldLabel);
            form.appendChild(fieldInput);
        }

        const btnGroup = document.createElement("div");
        btnGroup.classList.add("form-btn-group");

        const cancelBtn = document.createElement("input");
        cancelBtn.setAttribute("type", "button");
        cancelBtn.setAttribute("value", "Cancel");

        const submitBtn = document.createElement("input");
        submitBtn.setAttribute("type", "submit");
        submitBtn.setAttribute("value", "Create");
        submitBtn.textContent = "Create";

        btnGroup.appendChild(cancelBtn);
        btnGroup.appendChild(submitBtn);
        form.appendChild(btnGroup);

        return form;
    }

    static createNewPopUp(popUpTitle, newForm) {
        const popUpFormContainer = this.createPopUpSkeleton(popUpTitle);

        const cancelBtn = newForm.querySelector(
            'input[type="button"][value="Cancel"]'
        );
        cancelBtn.addEventListener("click", () => popUpFormContainer.remove());

        popUpFormContainer.querySelector(".pop-up-box").appendChild(newForm);

        return popUpFormContainer;
    }

    static createNewProjectPopUp() {
        return this.createNewPopUp("New Project", this.createNewProjectForm());
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
        submitBtn.textContent = "Create";

        btnGroup.appendChild(cancelBtn);
        btnGroup.appendChild(submitBtn);
        form.appendChild(btnGroup);

        return form;
    }

    static createNewProjectForm() {
        return this.createNewForm([
            new TextFormItem({
                labelText: "Project Name",
                id: "project-name",
                name: "project-name",
                required: true,
            }),
        ]);
    }

    static createNewTodoItemForm(existingValues = {}) {
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
                value: existingValues.date,
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
