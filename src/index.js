import { tasksFactory, manageTasks } from "./script-tasks";

const fns = require("date-fns");

console.log("hello");
const mainTasks = document.querySelector(".main-tasks");

const createNewElement = (element, className, text = null) => {
  const newElement = document.createElement(element);
  newElement.classList.add(className);
  newElement.innerText = text;
  return newElement;
};

const appendChildren = (parent, children) => {
  children.forEach((child) => {
    parent.appendChild(child);
  });
};

// // a template to make links work
// const sidebarList = document.querySelector('.sidebar-list');

// sidebarList.addEventListener('click', (e) => {
//     console.log(e.target.text);
//     if (e.target.text === 'Home') {
//         mainTasks.appendChild(tasksFactory('Privet'));
//     }
// })

// display the date in the header
const today = fns.format(new Date(), "EEEE, MMM d y");
const dateDisplay = document.querySelector(".today-date");
dateDisplay.innerText = today;

// open and close pop-up forms (create and edit)
// create form
const plusBtn = document.querySelector(".plus-btn");

plusBtn.addEventListener("click", () => {
  document.querySelector(".bg-form").style.display = "flex";
  document.querySelector(".todo-form").style =
    "transform: scale(1.1); font-weight: 700;";
});

const bgForm = document.querySelector(".bg-form");

bgForm.addEventListener("click", (e) => {
  // console.log(e.target.className);
  if (e.target.className === "bg-form" || e.target.className === "close-form") {
    bgForm.style.display = "none";
    document.querySelector(".task-edit-bg").style.display = "none";
  }
});

bgForm.addEventListener("keydown", (e) => {
  // console.log(e.keyCode);
  if (e.keyCode === 27) {
    bgForm.style.display = "none";
  }
});

// edit form
// manageTasks().openEditForm();
// manageTasks().closeEditForm();




// working links in pop-up form
const sidebarListForm = document.querySelector(".sidebar-list-form");

sidebarListForm.addEventListener("click", (e) => {
  // console.log(e.target.textContent);
  if (e.target.textContent === "TO-DO") {
    document.querySelector(".note-form").style =
      "transform: scale(1); font-weight: 400;";
    document.querySelector(".new-note-form").style.display = "none";
    document.querySelector(".new-task-form").style.display = "flex";
    document.querySelector(".todo-form").style =
      "transform: scale(1.1); font-weight: 700;";
  }
  if (e.target.textContent === "Note") {
    document.querySelector(".todo-form").style =
      "transform: scale(1); font-weight: 400;";
    document.querySelector(".new-task-form").style.display = "none";
    document.querySelector(".new-note-form").style.display = "flex";
    document.querySelector(".note-form").style =
      "transform: scale(1.1); font-weight: 700;";
  }
});


// hide create and delete tasks in IIFE module?
// delete targeted task
// function deleteTask() {
//   document.querySelectorAll(".task-delete").forEach((btn) =>
//     btn.addEventListener("click", (e) => {
//       mainTasks.removeChild(e.target.parentElement.parentElement);
//     })
//   );
// }
// deleteTask();

// create tasks
const submitBtn = document.querySelector('.submit-btn');

submitBtn.addEventListener('click', () => {
  mainTasks.appendChild(tasksFactory());
  bgForm.style.display = "none";
  manageTasks().deleteTask();
  manageTasks().openEditForm();
  manageTasks().closeEditForm();
})





// testing priority

// submitBtn.addEventListener('click', () => {
//     document.querySelectorAll('.priority-input').forEach((radioBtn) => {
//         // console.log(radioBtn.checked);
//         if (radioBtn.checked) {
//             console.log(radioBtn.value);
//         }
//     });
// })

// testing date input
// submitBtn.addEventListener('click', () => {
//     console.log(fns.format(new Date(document.querySelector('.due-date-input').value), "EEEE, MMM d y"));
// })

// testing title input
// submitBtn.addEventListener('click', () => {
//     console.log(document.querySelector('.task-title-form').value);
// })

