import {
  tasksFactory,
  manageTasks,
  createDefaultToDos,
  sortToLatestDate,
  sortTasks,
  sortTasksByProj,
  enableProjectInput,
  enableEditProjectInput
} from "./script-tasks";

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
};

const defaultToDos = [
  createDefaultToDos(
    "medium",
    "buy new shoes",
    "2023-03-29",
    "buy shoes for workout",
    "Gym"
  ),
  createDefaultToDos(
    "low",
    "buy a cake",
    "2023-03-25",
    "go to Fika for the birthday cake"
  ),
  createDefaultToDos(
    "high",
    "job interview",
    "2023-03-31",
    "work on soft skills prior to the interview",
    "Study"
  ),
  createDefaultToDos("low", "go to gym", "2023-05-01", "do squats and push-ups", "Gym"),
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
tasksList = [...mainTasks.childNodes];

// manageTasks().deleteTask();
// manageTasks().openEditForm();
// manageTasks().closeEditForm();

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

// navigate links in new task form
manageTasks().navigateForm();

// create tasks
const submitBtn = document.querySelector(".submit-btn");

submitBtn.addEventListener("click", () => {
  // mainTasks.appendChild(tasksFactory());
  // removeChildren(mainTasks);
  // tasksList.push(tasksFactory());
  tasksList.splice(0, tasksList.length);
  tasksList = [...mainTasks.childNodes];
  tasksList.push(tasksFactory());
  
  sortToLatestDate(tasksList);
  sortTasks(tasksList);
  appendChildren(mainTasks, tasksList);
  bgForm.style.display = "none";

  // manageTasks().deleteTask();
  // manageTasks().openEditForm();
  // manageTasks().closeEditForm();
});

let taskToBeEdited;
mainTasks.addEventListener('click', (e) => {
  console.log(e.target)
  // open edit form
  if (e.target.alt === 'edit') {
    taskToBeEdited = manageTasks().openEditForm(e);
    console.log(taskToBeEdited);
  }
  // delete task, resort and update task counter
  if (e.target.alt === 'delete') {
    manageTasks().deleteTask(e, tasksList);
    sortTasks(tasksList);
  }
});

// close edit form
const taskEditForm = document.querySelector(".task-edit-bg");
taskEditForm.addEventListener('click', (e) => {
  if (
    e.target.className === "task-edit-bg" ||
    e.target.className === "close-edit"
  ) {
    taskEditForm.style.display = "none";
  }
});

// edit a task
(() => {
  const editButton = document.querySelector('.submit-btn-edit');
  // const taskToBeEdited = manageTasks().openEditForm();
  editButton.addEventListener('click', () => {
    // existing values
    let taskTitle = taskToBeEdited[0];
    let taskDetails = taskToBeEdited[1]
    let taskDate = fns.format(new Date(taskToBeEdited[2]), "EEEE, MMM d y");
    let taskProject = taskToBeEdited[3];
    let taskPriority = taskToBeEdited[4];
    // edited inputs
    const editTaskTitle = document.querySelector('.task-title-edit');
    const editTaskDetails = document.querySelector('.task-text-edit');
    const editTaskDate = document.querySelector('.due-date-input-edit');
    const editTaskProj = document.querySelector('#project-name-edit');
    // inserting edited values
    taskTitle = editTaskTitle.value;
    taskDetails = editTaskDetails.value;
    taskDate = fns.format(new Date(editTaskDate.value), "EEEE, MMM d y");
    taskProject = editTaskProj.value;
    document.querySelectorAll('.priority-edit').forEach((radioBtn) => {
        if (radioBtn.checked) {
          taskPriority = radioBtn.value;
        }
    })
    // console.log(taskToBeEdited)
    // console.log(mainTasks.childNodes)
    mainTasks.removeChild(taskToBeEdited[5]);
    tasksList.splice(0, tasksList.length);
    tasksList = [...mainTasks.childNodes];
    tasksList.push(createDefaultToDos(taskPriority, taskTitle, taskDate, taskDetails, taskProject));
    sortToLatestDate(tasksList);
    sortTasks(tasksList);
    appendChildren(mainTasks, tasksList);
    

    // mainTasks.appendChild(createDefaultToDos(taskPriority, taskTitle, taskDate, taskDetails, taskProject));
    document.querySelector(".task-edit-bg").style.display = "none";

    // manageTasks().deleteTask();
    // manageTasks().openEditForm();
    // manageTasks().closeEditForm();

  })
})();

// navigate home/today/week/month pages

const sidebarList = document.querySelector(".sidebar-list");

sidebarList.addEventListener("click", (e) => {
  const sortedTasksList = sortTasks(tasksList);
  // console.log(e.target)
  switch (e.target.classList[1]) {
    case "home-page":
      removeChildren(mainTasks);
      appendChildren(mainTasks, tasksList);
      // document.querySelector('.home-counter').innerText = tasksList.length
      break;
    case "today-page":
      removeChildren(mainTasks);
      appendChildren(mainTasks, sortedTasksList[0]);
      // document.querySelector('.today-counter').innerText = sortedTasksList[0].length
      break;
    case "week-page":
      removeChildren(mainTasks);
      appendChildren(mainTasks, sortedTasksList[1]);
      // document.querySelector('.week-counter').innerText = sortedTasksList[1].length
      break;
    case "month-page":
      removeChildren(mainTasks);
      appendChildren(mainTasks, sortedTasksList[2]);
      // document.querySelector('.month-counter').innerText = sortedTasksList[2].length
      break;
    default:
      break;
  }
});


// checkbox for project input
enableProjectInput();
enableEditProjectInput();

// navigate among projects
document.querySelector('.sidebar-projects').addEventListener('click', (e) => {
  const projectsList = sortTasksByProj(tasksList);
  const sortedProjects = [];
  projectsList.forEach(item => {
    if (item[0] === e.target.innerText) {
      sortedProjects.push(item[1])
      removeChildren(mainTasks);
    }
  })
  appendChildren(mainTasks, sortedProjects);
});


// manageTasks().editForm()

// const manageTasks = (() => {
//   const taskEditBtns = document.querySelectorAll(".task-edit");
//   const taskEditForm = document.querySelector(".task-edit-bg");
//   const sidebarListForm = document.querySelector(".sidebar-list-form");

//   const closeEditForm = () => {
//     taskEditForm.addEventListener("click", (e) => {
//       if (
//         e.target.className === "task-edit-bg" ||
//         e.target.className === "close-edit"
//       ) {
//         taskEditForm.style.display = "none";
//       }
//     });
//   };

//   const deleteTask = () => {
//     document.querySelectorAll(".task-delete").forEach((btn) =>
//       btn.addEventListener("click", (e) => {
//         document.querySelector(".main-tasks").removeChild(e.target.parentElement.parentElement);
//       })
//     );
//   };

//   const openEditForm = () => {
//     const taskToBeEdited = [];
//     taskEditBtns.forEach((btn) => btn.addEventListener('click', (e) => {
//       taskEditForm.style.display = "flex";
//       // taskToBeEdited.splice(0, taskToBeEdited.length);
//       // existing values
//       const taskElement = e.target.parentElement.parentElement;
//       const taskTitle = e.target.parentElement.parentElement.childNodes[1].childNodes[1].innerText;
//       const taskDetails = e.target.parentElement.parentElement.childNodes[5].innerText;
//       let taskDate = e.target.parentElement.parentElement.childNodes[2].innerText;
//       taskDate = Date.parse(taskDate);
//       const taskProject = e.target.parentElement.parentElement.childNodes[6].innerText;
//       const taskPriority = e.target.parentElement.parentElement.childNodes[0].childNodes[0].innerText;
//       taskToBeEdited.push(taskTitle, taskDetails, taskDate, taskProject, taskPriority, taskElement);

//       // select edit-form inputs
//       const editTaskTitle = document.querySelector('.task-title-edit');
//       const editTaskDetails = document.querySelector('.task-text-edit');
//       const editTaskDate = document.querySelector('.due-date-input-edit');
//       const editTaskProj = document.querySelector('#project-name-edit');
//       const editTaskPriority = document.querySelector(`#priority-edit-${taskPriority}`);
//       // insert existing values
//       editTaskTitle.value = taskTitle;
//       editTaskDetails.value = taskDetails;
//       editTaskDate.value = fns.format(new Date(taskDate), 'yyyy-MM-dd');
//       if (taskProject === 'undefined') {
//         editTaskProj.value = null;
//       } else {
//         editTaskProj.value = taskProject;
//       }
//       editTaskPriority.checked = true;

//       // confirm edits
//       // const editButton = document.querySelector('.submit-btn-edit');
//       // editButton.addEventListener('click', () => {
//       //   taskTitle = editTaskTitle.value;
//       //   taskDetails = editTaskDetails.value;
//       //   taskDate = fns.format(new Date(editTaskDate.value), "EEEE, MMM d y");
//       //   taskProject = editTaskProj.value;
        
//       //   document.querySelectorAll('.priority-edit').forEach((radioBtn) => {
//       //       if (radioBtn.checked) {
//       //         taskPriority = radioBtn.value;
//       //       }
//       //   })

//       //   document.querySelector(".main-tasks").removeChild(e.target.parentElement.parentElement);
//       //   document.querySelector(".main-tasks").appendChild(createDefaultToDos(taskPriority, taskTitle, taskDate, taskDetails, taskProject));
//       //   taskEditForm.style.display = "none";
//       // })
//     }));
//     return taskToBeEdited;
//   };

//   const editForm = () => {
//     const editButton = document.querySelector('.submit-btn-edit');
//     const taskToBeEdited = openEditForm();
//     editButton.addEventListener('click', () => {
//       // existing values
//       let taskTitle = taskToBeEdited[0];
//       let taskDetails = taskToBeEdited[1]
//       let taskDate = fns.format(new Date(taskToBeEdited[2]), "EEEE, MMM d y");
//       let taskProject = taskToBeEdited[3]
//       let taskPriority = taskToBeEdited[4];
//       // edited inputs
//       const editTaskTitle = document.querySelector('.task-title-edit');
//       const editTaskDetails = document.querySelector('.task-text-edit');
//       const editTaskDate = document.querySelector('.due-date-input-edit');
//       const editTaskProj = document.querySelector('#project-name-edit');
//       // inserting edited values
//       taskTitle = editTaskTitle.value;
//       taskDetails = editTaskDetails.value;
//       taskDate = fns.format(new Date(editTaskDate.value), "EEEE, MMM d y");
//       taskProject = editTaskProj.value;
//       document.querySelectorAll('.priority-edit').forEach((radioBtn) => {
//           if (radioBtn.checked) {
//             taskPriority = radioBtn.value;
//           }
//       })

//       document.querySelector(".main-tasks").removeChild(taskToBeEdited[5]);
//       document.querySelector(".main-tasks").appendChild(createDefaultToDos(taskPriority, taskTitle, taskDate, taskDetails, taskProject));
//       taskEditForm.style.display = "none";
//     })
//   }

//   const navigateForm = () => {
//     sidebarListForm.addEventListener("click", (e) => {
//       if (e.target.textContent === "TO-DO") {
//         document.querySelector(".note-form").style =
//           "transform: scale(1); font-weight: 400;";
//         document.querySelector(".new-note-form").style.display = "none";
//         document.querySelector(".new-task-form").style.display = "flex";
//         document.qtuerySelector(".todo-form").style =
//           "transform: scale(1.1); font-weight: 700;";
//       }
//       if (e.target.textContent === "Note") {
//         document.querySelector(".todo-form").style =
//           "transform: scale(1); font-weight: 400;";
//         document.querySelector(".new-task-form").style.display = "none";
//         document.querySelector(".new-note-form").style.display = "flex";
//         document.querySelector(".note-form").style =
//           "transform: scale(1.1); font-weight: 700;";
//       }
//     });
//   };

  

//   return {openEditForm, closeEditForm, deleteTask, navigateForm, editForm};
// })();

// console.log(sortTasksByProj())

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
