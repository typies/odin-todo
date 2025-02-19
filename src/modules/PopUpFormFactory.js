export default class PopUpFormFactory {
    static createPopUp(formInputs) {
        const popUpFormContainer = document.createElement("div");
        popUpFormContainer.classList.add("pop-up-form-container");

        const popUpBox = document.createElement("div");
        popUpBox.classList.add("pop-up-box");
        const newForm = this.createForm(formInputs);

        const cancelBtn = newForm.querySelector(
            'input[type="button"][value="Cancel"]'
        );
        cancelBtn.addEventListener("click", () => popUpFormContainer.remove());

        popUpBox.appendChild(newForm);
        popUpFormContainer.appendChild(popUpBox);

        return popUpFormContainer;
    }

    static createForm(formInputs) {
        const form = document.createElement("form");
        form.classList.add("form-container");
        for (const field of formInputs) {
            const fieldLabel = document.createElement("label");
            fieldLabel.textContent = field.labelText;
            if (field.labelClass) fieldLabel.classList.add(field.labelClass);
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
}
