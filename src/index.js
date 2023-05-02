import { format } from "date-fns";
import {
  tasksFactory,
  manageTasks,
  createDefaultToDos,
  sortToLatestDate,
  sortTasksNav,
  sortTasksByProj,
  enableProjectInput,
  enableEditProjectInput,
  openSummaryCard,
  closeSumCard,
  fillSumCard,
  deleteProjects,
  storeTasks,
  showProjs,
  // createNewElement
} from "./script-tasks";
import { createDefaultNotes, deleteNote, notesFactory, storeNotes } from "./script-notes";

// const fns = require("date-fns");

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
    "2023-04-29",
    "buy shoes for workout",
    "Gym"
  ),
  createDefaultToDos(
    "low",
    "buy, a cake",
    "2023-04-25",
    "go to Fika for the birthday cake"
  ),
  createDefaultToDos(
    "high",
    "job interview",
    "2023-04-30",
    "work on soft skills prior to the interview",
    "Study"
  ),
  createDefaultToDos(
    "low",
    "go to gym",
    "2023-06-01",
    "do squats and push-ups",
    "Gym"
  ),
];

const defaultNotes = [
  createDefaultNotes("Movies to watch", "Four rooms, Silverado, Inception"),
  createDefaultNotes("Places to visit", "Tokyo, Kyoto, Osaka"),
];

// an array with todos
let tasksList = [];
// an array with note
let notesList = [];



// tasksList = tasksList.concat(defaultToDos);
// sort the array to the latest date and it to the DOM
// sortToLatestDate(tasksList);
// sortTasksNav(tasksList);
// appendChildren(mainTasks, tasksList);

sortToLatestDate(defaultToDos);
sortTasksNav(defaultToDos);
// if localStorage is empty create default todos and notes otherwise load todos and notes from the storage
if (localStorage.length === 0 || localStorage.getItem('tasks') === null) {
  tasksList = [...defaultToDos];
  storeTasks(tasksList);
  // localStorage.setItem('tasks', tasksStorage);
  appendChildren(mainTasks, defaultToDos);
  sortTasksNav(tasksList);
  showProjs();
  // console.log('case1')
} else {
  mainTasks.innerHTML = localStorage.getItem('tasks');
  tasksList = [...mainTasks.childNodes];
  sortTasksNav(tasksList);
  showProjs();
  // console.log('case2')
}

// appendChildren(mainTasks, defaultToDos);

// manageTasks().deleteTask();
// manageTasks().openEditForm();
// manageTasks().closeEditForm();

// display the date in the header
const today = format(new Date(), "EEEE, MMM d y");
const dateDisplay = document.querySelector(".today-date");
dateDisplay.innerText = today;

// open and close pop-up forms (create and edit)
const plusBtn = document.querySelector(".plus-btn");

plusBtn.addEventListener("click", () => {
  // clean new task form before displaying
  document.querySelector(".task-title-form").value = "";
  document.querySelector("#priority-low").checked = true;
  document.querySelector(".due-date-input").value = "";
  document.querySelector(".task-text-form").value = "";
  document.querySelector("#project-check").checked = false;
  document.querySelector("#project-name").disabled = true;
  document.querySelector("#project-name").value = "";
  // clean new note form before displaying
  document.querySelector(".note-title-form").value = "";
  document.querySelector(".note-text-form").value = "";
  // open the form
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

// navigate links in new task form
manageTasks().navigateForm();

// create tasks
const submitBtn = document.querySelector(".submit-task-btn");

submitBtn.addEventListener("click", () => {
  // mainTasks.appendChild(tasksFactory());
  // removeChildren(mainTasks);
  // tasksList.push(tasksFactory());
  // console.log(tasksList)
  // tasksList.splice(0, tasksList.length);
  // tasksList = [...mainTasks.childNodes];
  tasksList.push(tasksFactory());

  sortToLatestDate(tasksList);
  sortTasksNav(tasksList);
  appendChildren(mainTasks, tasksList);
  storeTasks(tasksList);
  bgForm.style.display = "none";

  // manageTasks().deleteTask();
  // manageTasks().openEditForm();
  // manageTasks().closeEditForm();
});

// manage tasks
let taskToBeEdited;
mainTasks.addEventListener("click", (e) => {
  console.log(e.target)
  // const arr = ['Title', 'Details', 'Sunday, Apr 9 2023', 'Project', 'Low'];
  // open task summary
  if (
    e.target.className === "task" ||
    e.target.className === "task-title" ||
    e.target.className === "task-title-checkbox"
  ) {
    console.log(fillSumCard(e));
    openSummaryCard(fillSumCard(e));
    document.querySelector(".task-sum-bg").style.display = "flex";
    closeSumCard();
  }
  // open edit form
  if (e.target.alt === "edit") {
    taskToBeEdited = manageTasks().openEditForm(e);
    console.log(taskToBeEdited);
  }
  // delete task, sort tasks, and update task counter
  if (e.target.alt === "delete") {
    manageTasks().deleteTask(e, tasksList);
    sortTasksNav(tasksList);
    // check if "Project name" is not among the keys then delete the project
    deleteProjects(tasksList);
    storeTasks(tasksList);
  }
  // mark task as checked
  if (e.target.id === 'task-title') {
    manageTasks().markChecked(e);
  }
});

// close edit form
const taskEditForm = document.querySelector(".task-edit-bg");
taskEditForm.addEventListener("click", (e) => {
  if (
    e.target.className === "task-edit-bg" ||
    e.target.className === "close-edit"
  ) {
    taskEditForm.style.display = "none";
  }
});

// edit a task
(() => {
  const editButton = document.querySelector(".submit-btn-edit");
  // const taskToBeEdited = manageTasks().openEditForm();
  editButton.addEventListener("click", () => {
    // existing values
    let taskTitle = taskToBeEdited[0];
    let taskDetails = taskToBeEdited[1];
    let taskDate = format(new Date(taskToBeEdited[2]), "EEEE, MMM d y");
    let taskProject = taskToBeEdited[3];
    let taskPriority = taskToBeEdited[4];
    // edited inputs
    const editTaskTitle = document.querySelector(".task-title-edit");
    const editTaskDetails = document.querySelector(".task-text-edit");
    const editTaskDate = document.querySelector(".due-date-input-edit");
    const editTaskProj = document.querySelector("#project-name-edit");
    // inserting edited values
    taskTitle = editTaskTitle.value;
    taskDetails = editTaskDetails.value;
    taskDate = format(new Date(editTaskDate.value), "EEEE, MMM d y");
    taskProject = editTaskProj.value;
    document.querySelectorAll(".priority-edit").forEach((radioBtn) => {
      if (radioBtn.checked) {
        taskPriority = radioBtn.value;
      }
    });
    // console.log(taskToBeEdited)
    // console.log(mainTasks.childNodes)
    mainTasks.removeChild(taskToBeEdited[5]);
    tasksList.splice(0, tasksList.length);
    tasksList = [...mainTasks.childNodes];
    tasksList.push(
      createDefaultToDos(
        taskPriority,
        taskTitle,
        taskDate,
        taskDetails,
        taskProject
      )
    );
    sortToLatestDate(tasksList);
    sortTasksNav(tasksList);
    appendChildren(mainTasks, tasksList);
    storeTasks(tasksList);

    // mainTasks.appendChild(createDefaultToDos(taskPriority, taskTitle, taskDate, taskDetails, taskProject));
    document.querySelector(".task-edit-bg").style.display = "none";

    // manageTasks().deleteTask();
    // manageTasks().openEditForm();
    // manageTasks().closeEditForm();
  });
})();

// navigate home/today/week/month pages
const sidebarList = document.querySelector(".sidebar-list");

sidebarList.addEventListener("click", (e) => {
  const sortedTasksList = sortTasksNav(tasksList);
  // console.log(e.target)
  switch (e.target.classList[1]) {
    case "home-page":
      if (mainTasks.classList[1] === "main-notes") {
        mainTasks.classList.toggle("main-notes");
      }
      removeChildren(mainTasks);
      appendChildren(mainTasks, tasksList);
      // document.querySelector('.home-counter').innerText = tasksList.length
      break;
    case "today-page":
      if (mainTasks.classList[1] === "main-notes") {
        mainTasks.classList.toggle("main-notes");
      }
      removeChildren(mainTasks);
      appendChildren(mainTasks, sortedTasksList[0]);
      // document.querySelector('.today-counter').innerText = sortedTasksList[0].length
      break;
    case "week-page":
      if (mainTasks.classList[1] === "main-notes") {
        mainTasks.classList.toggle("main-notes");
      }
      removeChildren(mainTasks);
      appendChildren(mainTasks, sortedTasksList[1]);
      // document.querySelector('.week-counter').innerText = sortedTasksList[1].length
      break;
    case "month-page":
      if (mainTasks.classList[1] === "main-notes") {
        mainTasks.classList.toggle("main-notes");
      }
      removeChildren(mainTasks);
      appendChildren(mainTasks, sortedTasksList[2]);
      // document.querySelector('.month-counter').innerText = sortedTasksList[2].length
      break;
    case "notes-page":
      if (!(mainTasks.classList[1] === "main-notes")) {
        mainTasks.classList.toggle("main-notes");
      }
      removeChildren(mainTasks);
      // appendChildren(mainTasks, defaultNotes);
      if (localStorage.getItem('notes') === null) {
        notesList = [...defaultNotes];
        storeNotes(notesList);
        appendChildren(mainTasks, notesList);
      } else {
        mainTasks.innerHTML = localStorage.getItem('notes');
        notesList = [...mainTasks.childNodes];
      }
      // edit note
      document.querySelector('.note-title').addEventListener('change', (event) => {
        // eslint-disable-next-line no-param-reassign
        event.target.innerText = event.target.value;
          notesList = [...mainTasks.childNodes];
          storeNotes(notesList);
        }
      );
      document.querySelector('.note-text').addEventListener('change', (event) => {
        // eslint-disable-next-line no-param-reassign
        event.target.innerText = event.target.value;
          notesList = [...mainTasks.childNodes];
          storeNotes(notesList);
        }
      );
      // delete a note
      document
        .querySelector(".main-notes")
        .addEventListener("click", (event) => {
          if (event.target.classList[0] === "delete-note") {
            deleteNote(event, notesList);
            storeNotes(notesList);
          }
        });
      // mainTasks.classList.toggle('main-notes');
      break;
    default:
      break;
  }
});

// checkbox for project input
enableProjectInput(tasksList);
enableEditProjectInput(tasksList);

// navigate among projects
document.querySelector(".sidebar-projects").addEventListener("click", (e) => {
  if (mainTasks.classList[1] === "main-notes") {
    mainTasks.classList.toggle("main-notes");
  }
  const projectsList = sortTasksByProj(tasksList);
  const sortedProjects = [];
  projectsList.forEach((item) => {
    if (item[0] === e.target.innerText) {
      sortedProjects.push(item[1]);
      removeChildren(mainTasks);
    }
  });
  appendChildren(mainTasks, sortedProjects);
});

// mark the task checked
// document.querySelectorAll(".task-title-checkbox").forEach((item) => {
//   item.addEventListener("click", (e) => {
//     manageTasks().markChecked(e);
//   });
// });

// notes pages

// create a note
document.querySelector(".submit-note-btn").addEventListener("click", () => {
  removeChildren(mainTasks);
  // appendChildren(mainTasks, defaultNotes);
  notesList.push(notesFactory());
  appendChildren(mainTasks, notesList);
  storeNotes(notesList);
  if (!(mainTasks.classList[1] === "main-notes")) {
    mainTasks.classList.toggle("main-notes");
  }
  // mainTasks.classList.toggle('main-notes');
  bgForm.style.display = "none";
});


// testing projects display


// showProjs();


// let tasksStorageList = "";
// tasksList.forEach((item) => {
//   const value = item.outerHTML;
  
//   tasksStorageList += value;
// })
// console.log(tasksList)


// mainTasks.innerHTML = localStorage.getItem('tasks')

// eslint-disable-next-line no-plusplus
// for (let i = 0; i < tasksList.length; i++) {
//   const value = tasksList[i].innerHTML;
//   localStorage.setItem(i, value);
// }

// const testDiv = createNewElement('div', 'task');
// testDiv.innerHTML = localStorage.getItem('0');
// // mainTasks.appendChild(testDiv);
// console.log(tasksList)



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
