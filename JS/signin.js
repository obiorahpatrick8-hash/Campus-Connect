const inputs = document.querySelectorAll("input");
const errors = document.querySelectorAll(".para");
const form = document.querySelector("form");
const signinMessage = document.querySelector("#signin-message");

const fieldMessages = {
    name: "field can't be empty",
    email: "field can't be empty",
    number: "field can't be empty",
    password: "field can't be empty",
    university: "field can't be empty"
}

function validateField(index) {
    const input = inputs[index]
    const error = errors[index]
    const inputName = input.name || input.id
    const errorMessage = fieldMessages[inputName] || "This field cannot be empty"

    if (input.value.trim() === "") {
        error.textContent = errorMessage
        error.style.color = "red"
        error.style.fontSize = "14px"
        error.style.fontWeight = "lighter"
        input.style.border = "2px solid #e05252"
    } else {
        error.textContent = ""
        error.style.color = ""
        input.style.border = "2px solid black"
    }
}

for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener("blur", function () {
        validateField(i)
    })

    inputs[i].addEventListener("input", function () {
        if (this.value.trim() !== "") {
            errors[i].textContent = ""
            errors[i].style.color = ""
            this.style.border = "2px solid black"
        }
    })
}

form.addEventListener("submit", function (event) {
    event.preventDefault();

    let isValid = true;
    for (let i = 0; i < inputs.length; i++) {
        validateField(i)
        if (inputs[i].required && inputs[i].value.trim() === "") {
            isValid = false;
        }
    }

    if (isValid) {
        signinMessage.textContent = "Sign-up successful!";
        signinMessage.style.color = "green";
        signinMessage.style.textAlign = "center";
        window.setTimeout(function () {
            window.location.href = "dashboard.html";
        }, 1000);
    } else {
        signinMessage.textContent = "Please fill in the required fields.";
        signinMessage.style.color = "red";
        signinMessage.style.textAlign = "center";
    }
});


// toggle password button
const toggleButtons = document.querySelectorAll(".toggle-password");

toggleButtons.forEach(function (button) {

    button.addEventListener("click", function () {
        const passwordField =
            button.parentElement.querySelector("input");
        const closedEye =
            button.querySelector(".eye-closed");
        const openEye =
            button.querySelector(".eye-open");

        if (passwordField.type === "password") {
            // show passowrd
            passwordField.type = "text";

            // change eye
            closedEye.hidden = true;
            openEye.hidden = false;
        } else {
            // Hide password
            passwordField.type = "password";

            // change eye back
            closedEye.hidden = false;
            openEye.hidden = true;
        }
    }
    );
}
);
