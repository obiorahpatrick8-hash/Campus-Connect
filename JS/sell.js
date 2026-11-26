const sellForm = document.getElementById("sell-form");
const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");
const step3 = document.getElementById("step3");

const next1 = document.getElementById("next1");
const back2 = document.querySelector(".back2");
const next2 = document.getElementById("next2");
const back3 = document.querySelector(".back3");
const publishButton = document.querySelector(".publish");
const message = document.getElementById("message-text");

const productName = document.getElementById("product-name");
const productPrice = document.getElementById("product-price");
const productCategory = document.getElementById("product-category");
const productCondition = document.getElementById("product-condition");
const productDescription = document.getElementById("product-description");

const imageInput = document.getElementById("product-images");
const imageSelectionPreview = document.getElementById("image-preview");

const previewTitle = document.getElementById("preview-title");
const previewPrice = document.getElementById("preview-price");
const previewCategory = document.getElementById("preview-category");
const previewCondition = document.getElementById("preview-condition");
const previewDescription = document.getElementById("preview-description");
const previewImages = document.getElementById("preview-images");

function showStep(stepNumber) {
    step1.hidden = stepNumber !== 1;
    step2.hidden = stepNumber !== 2;
    step3.hidden = stepNumber !== 3;

    const progressSteps = document.querySelectorAll(".steps .step");
    progressSteps.forEach((step, index) => {
        step.classList.toggle("active", index < stepNumber);
    });

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function renderImages(container) {
    container.replaceChildren();
    for (const file of imageInput.files) {
        const image = document.createElement("img");
        image.src = URL.createObjectURL(file);
        image.alt = file.name;
        image.addEventListener("load", () => URL.revokeObjectURL(image.src), { once: true });
        container.appendChild(image);
    }
}

function updateProductPreview() {
    previewTitle.textContent = productName.value;
    previewPrice.textContent = `\u20A6${productPrice.value}`;
    previewCategory.textContent = productCategory.value;
    previewCondition.textContent = productCondition.value;
    previewDescription.textContent = productDescription.value;
    renderImages(previewImages);
}

imageInput.addEventListener("change", function() {
    renderImages(imageSelectionPreview);
});

function validateStep1() {
    const fields = step1.querySelectorAll("input, select, textarea");
    for (const field of fields) {
        if (!field.checkValidity()){
            field.reportValidity();
            return false
        }
    }
    return true
}


next1.addEventListener("click", function(){
    if(validateStep1()) {
        showStep(2);
    }
});

back2.addEventListener("click", function() {
    showStep(1);
});

next2.addEventListener("click", function() {
    if(imageInput.files.length === 0) {
        alert("Please upload at least one product image.");
        return
    }
    updateProductPreview();
    showStep(3);
});

back3.addEventListener("click", function() {
    showStep(2);
});

showStep(1);

sellForm.noValidate = true;
sellForm.addEventListener("submit", function(event) {
    event.preventDefault();
    publishButton.disabled = true;
    message.textContent = "Publishing your product... Please wait 5 seconds.";
    message.style.color = "green";
    message.style.fontWeight = "bold";
    message.style.textAlign = "center";

    setTimeout(function() {
        sellForm.submit();
    }, 5000);
});
