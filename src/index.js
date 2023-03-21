import { tasksFactory, manageTasks, createDefaultToDos } from "./script-tasks";

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

// create an array with predefined todos
let tasksList = [];
tasksList = tasksList.concat(defaultToDos);

// create an array with sorted lists of tasks today/week/month
const sortToLatestDate = (arr) => {
    arr.sort((a, b) => {
    let date1 = Date.parse(a.childNodes[2].innerText);
    date1 = fns.format(new Date(date1), 'yyyy-MM-dd');
    date1 = fns.parseISO(date1);
    
    let date2 = Date.parse(b.childNodes[2].innerText);
    date2 = fns.format(new Date(date2), 'yyyy-MM-dd');
    date2 = fns.parseISO(date2);

    return date1 - date2;
  });
};

sortToLatestDate(tasksList);

appendChildren(mainTasks, tasksList);

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

// working links in pop-up form
const sidebarListForm = document.querySelector(".sidebar-list-form");

sidebarListForm.addEventListener("click", (e) => {
  if (e.target.textContent === "TO-DO") {
    document.querySelector(".note-form").style =
      "transform: scale(1); font-weight: 400;";
    document.querySelector(".new-console.log(tasksList);note-form").style.display = "none";
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

const sortTasks = () => {
  const sortedTasksList = [];
  const todayTasks = [];
  const weekTasks = [];
  const monthTasks = [];
  // eslint-disable-next-line guard-for-in, no-restricted-syntax
  for (const i in tasksList) {
    let formatedDate = Date.parse(tasksList[i].childNodes[2].innerText);
    formatedDate = fns.format(new Date(formatedDate), 'yyyy-MM-dd');
    formatedDate = fns.parseISO(formatedDate);
    if (fns.isToday(formatedDate)) {
      todayTasks.push(tasksList[i]);
    }
    if (fns.isThisWeek(formatedDate)) {
      weekTasks.push(tasksList[i]);
    }
    if (fns.isThisMonth(formatedDate)) {
      monthTasks.push(tasksList[i]);
    }
  }
  sortedTasksList.push(todayTasks, weekTasks, monthTasks);
  // display the amount of tasks in counters
  document.querySelector('.home-counter').innerText = tasksList.length;
  document.querySelector('.today-counter').innerText = sortedTasksList[0].length;
  document.querySelector('.week-counter').innerText = sortedTasksList[1].length;
  document.querySelector('.month-counter').innerText = sortedTasksList[2].length;
  
  return sortedTasksList;
}

sortTasks();

// create tasks
const submitBtn = document.querySelector('.submit-btn');

submitBtn.addEventListener('click', () => {
  // if (mainTasks.childNodes.length === 0) {
  //   mainTasks.appendChild(tasksFactory());
  //   tasksList.push(tasksFactory())
  // } else {
  //   mainTasks.insertBefore(tasksFactory(), mainTasks.childNodes[0]);
  //   tasksList.push(tasksFactory());
  // }

  // mainTasks.appendChild(tasksFactory());
  removeChildren(mainTasks);
  tasksList.push(tasksFactory());
  sortToLatestDate(tasksList);
  appendChildren(mainTasks, tasksList);
  bgForm.style.display = "none";

  manageTasks().deleteTask();
  manageTasks().openEditForm();
  manageTasks().closeEditForm();
  sortTasks();
});

// console.log(tasksList[0].childNodes[0].style.backgroundColor);

// display home/today/week/month pages

const sidebarList = document.querySelector('.sidebar-list');

sidebarList.addEventListener('click', (e) => {
  const sortedTasksList = sortTasks();
  console.log(e.target)
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