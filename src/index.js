import { tasksFactory, manageTasks, createDefaultToDos, sortToLatestDate, sortTasks} from "./script-tasks";

const fns = require("date-fns");

console.log("hello");
const mainTasks = document.querySelector(".main-tasks");

const appendChildren = (parent, children) => {
  children.forEach((child) => {
    parent.appendChild(child);
  });
};

const removeChildren = (parent) => {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

const defaultToDos = [
  createDefaultToDos("medium", "pay rent", "2023-03-29", "transfer on a bank account"),
  createDefaultToDos("low", "buy a cake", "2023-03-25", "go to Fika for the birthday cake"),
  createDefaultToDos("high", "job interview", "2023-03-31", "work on soft skills prior to the interview"),
  createDefaultToDos("low", "go to gym", "2023-05-01", "do squats")
];

// create an array with todos
let tasksList = [];
// tasksList = tasksList.concat(defaultToDos);
// sort the array to the latest date and it to the DOM
// sortToLatestDate(tasksList);
// sortTasks(tasksList);
// appendChildren(mainTasks, tasksList);

sortToLatestDate(defaultToDos);
sortTasks(defaultToDos);
appendChildren(mainTasks, defaultToDos);
tasksList = [... mainTasks.childNodes];


manageTasks().deleteTask();
manageTasks().openEditForm();
manageTasks().closeEditForm();

// display the date in the header
const today = fns.format(new Date(), "EEEE, MMM d y");
const dateDisplay = document.querySelector(".today-date");
dateDisplay.innerText = today;

// open and close pop-up forms (create and edit)
const plusBtn = document.querySelector(".plus-btn");

plusBtn.addEventListener("click", () => {
  document.querySelector(".bg-form").style.display = "flex";
  // document.querySelector('.new-task-form').appendChild(createNewTask());
  document.querySelector(".todo-form").style =
    "transform: scale(1.1); font-weight: 700;";
});

const bgForm = document.querySelector(".bg-form");

bgForm.addEventListener("click", (e) => {
  if (e.target.className === "bg-form" || e.target.className === "close-form") {
    bgForm.style.display = "none";
    document.querySelector(".task-edit-bg").style.display = "none";
  }
});

bgForm.addEventListener("keydown", (e) => {
  if (e.keyCode === 27) {
    bgForm.style.display = "none";
  }
});

// navigate links in edit form
manageTasks().navigateEditForm();

// create tasks
const submitBtn = document.querySelector('.submit-btn');

submitBtn.addEventListener('click', () => {
  mainTasks.appendChild(tasksFactory());
  // removeChildren(mainTasks);
  // tasksList.push(tasksFactory());
  tasksList.splice(0, tasksList.length);
  tasksList = [... mainTasks.childNodes];
  sortToLatestDate(tasksList);
  sortTasks(tasksList);
  // appendChildren(mainTasks, tasksList);
  bgForm.style.display = "none";

  manageTasks().deleteTask();
  manageTasks().openEditForm();
  manageTasks().closeEditForm();
});

// console.log(tasksList[0].childNodes[0].style.backgroundColor);

// display home/today/week/month pages

const sidebarList = document.querySelector('.sidebar-list');

sidebarList.addEventListener('click', (e) => {
  const sortedTasksList = sortTasks(tasksList);
  // console.log(e.target)
  switch(e.target.classList[1]) {
    case 'home-page':
      removeChildren(mainTasks);
      appendChildren(mainTasks, tasksList);
      // document.querySelector('.home-counter').innerText = tasksList.length
      break;
    case 'today-page':
      removeChildren(mainTasks);
      appendChildren(mainTasks, sortedTasksList[0]);
      // document.querySelector('.today-counter').innerText = sortedTasksList[0].length
      break;
    case 'week-page':
      removeChildren(mainTasks);
      appendChildren(mainTasks, sortedTasksList[1]);
      // document.querySelector('.week-counter').innerText = sortedTasksList[1].length
      break;
    case 'month-page':
      removeChildren(mainTasks);
      appendChildren(mainTasks, sortedTasksList[2]);
      // document.querySelector('.month-counter').innerText = sortedTasksList[2].length
      break;
    default:
      break;
  }
})

const enableProjectInput = () => {
  const projectCheckbox = document.querySelector('#project-check');
  const projectDataList = document.querySelector('#project-list');
  projectCheckbox.addEventListener('click', () => {
    if (projectCheckbox.checked) {
      document.querySelector('#project-name').disabled = false;
      document.querySelectorAll('.project-item-link').forEach((item) => {
        const option = document.createElement('option');
        option.setAttribute('value', '');
        option.value = item.innerText;
        option.innerText = item.innerText;
        projectDataList.appendChild(option);
      })
    } else {
      document.querySelector('#project-name').disabled = true;
    }
  })
}

enableProjectInput()

// console.log(mainTasks.childNodes, tasksList);


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

// testing the date
// eslint-disable-next-line no-restricted-syntax, guard-for-in
// for (const i in tasksList) {
//   let formatedDate = Date.parse(tasksList[i].childNodes[2].innerText);
//   formatedDate = fns.format(new Date(formatedDate), 'yyyy-MM-dd');
//   formatedDate = fns.parseISO(formatedDate);
//   console.log(fns.isToday(formatedDate));
// }
// create an array with a sorted lists for each period of time