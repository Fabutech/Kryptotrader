const change = document.querySelectorAll(".forexchangebtn");
const forms = document.querySelector(".forms");

change.forEach(button => {
    button.addEventListener("click", () => {
       forms.classList.toggle("show-sell");
    })
})
