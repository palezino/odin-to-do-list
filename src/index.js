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
} from "./script-tasks";
import {
  createDefaultNotes,
  deleteNote,
  notesFactory,
  storeNotes,
} from "./script-notes";

// take an element with tasks
const mainTasks = document.querySelector(".main-tasks");

// functions that help to manage HTML elements
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

// an array with default todos
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
    "buy a cake",
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

// an array with default notes
const defaultNotes = [
  createDefaultNotes("Movies to watch", "Four rooms, Silverado, Inception"),
  createDefaultNotes("Places to visit", "Tokyo, Kyoto, Osaka"),
];

// an array that will contain all todos
let tasksList = [];
// an array that will contain all notes
let notesList = [];

// sort default todos for to the latest date and for navigation links
sortToLatestDate(defaultToDos);
sortTasksNav(defaultToDos);
// if localStorage is empty create default todos and notes otherwise load todos and notes from the storage
if (localStorage.length === 0 || localStorage.getItem("tasks") === null) {
  tasksList = [...defaultToDos];
  storeTasks(tasksList);
  appendChildren(mainTasks, defaultToDos);
  sortTasksNav(tasksList);
  showProjs();
} else {
  mainTasks.innerHTML = localStorage.getItem("tasks");
  tasksList = [...mainTasks.childNodes];
  sortTasksNav(tasksList);
  showProjs();
}

// display the date in the header
const today = format(new Date(), "EEEE, MMM d y");
const dateDisplay = document.querySelector(".today-date");
dateDisplay.innerText = today;

// open 'new task' form
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

// close 'new task' form
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
  tasksList.push(tasksFactory());
  sortToLatestDate(tasksList);
  sortTasksNav(tasksList);
  appendChildren(mainTasks, tasksList);
  storeTasks(tasksList);
  bgForm.style.display = "none";
});

// manage tasks
let taskToBeEdited;
mainTasks.addEventListener("click", (e) => {
  // open task summary
  if (
    e.target.className === "task" ||
    e.target.className === "task-title" ||
    e.target.className === "task-title-checkbox"
  ) {
    openSummaryCard(fillSumCard(e));
    document.querySelector(".task-sum-bg").style.display = "flex";
    closeSumCard();
  }
  // open edit form
  if (e.target.alt === "edit") {
    taskToBeEdited = manageTasks().openEditForm(e);
  }
  // delete task, sort tasks, and update task counter
  if (e.target.alt === "delete") {
    manageTasks().deleteTask(e, tasksList);
    sortTasksNav(tasksList);
    // delete the project if "Project name" is not among the keys
    deleteProjects(tasksList);
    storeTasks(tasksList);
  }
  // mark task as checked
  if (e.target.id === "task-title") {
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
    document.querySelector(".task-edit-bg").style.display = "none";
  });
})();

// navigate home/today/week/month/notes pages
const sidebarList = document.querySelector(".sidebar-list");
sidebarList.addEventListener("click", (e) => {
  const sortedTasksList = sortTasksNav(tasksList);
  switch (e.target.classList[1]) {
    case "home-page":
      if (mainTasks.classList[1] === "main-notes") {
        mainTasks.classList.toggle("main-notes");
      }
      removeChildren(mainTasks);
      appendChildren(mainTasks, tasksList);
      break;
    case "today-page":
      if (mainTasks.classList[1] === "main-notes") {
        mainTasks.classList.toggle("main-notes");
      }
      removeChildren(mainTasks);
      appendChildren(mainTasks, sortedTasksList[0]);
      break;
    case "week-page":
      if (mainTasks.classList[1] === "main-notes") {
        mainTasks.classList.toggle("main-notes");
      }
      removeChildren(mainTasks);
      appendChildren(mainTasks, sortedTasksList[1]);
      break;
    case "month-page":
      if (mainTasks.classList[1] === "main-notes") {
        mainTasks.classList.toggle("main-notes");
      }
      removeChildren(mainTasks);
      appendChildren(mainTasks, sortedTasksList[2]);
      break;
    case "notes-page":
      if (!(mainTasks.classList[1] === "main-notes")) {
        mainTasks.classList.toggle("main-notes");
      }
      removeChildren(mainTasks);
      // check if there are notes in the localStorage
      if (localStorage.getItem("notes") === null) {
        notesList = [...defaultNotes];
        storeNotes(notesList);
        appendChildren(mainTasks, notesList);
      } else {
        mainTasks.innerHTML = localStorage.getItem("notes");
        notesList = [...mainTasks.childNodes];
      }
      // edit note
      document
        .querySelector(".note-title")
        .addEventListener("change", (event) => {
          // eslint-disable-next-line no-param-reassign
          event.target.innerText = event.target.value;
          notesList = [...mainTasks.childNodes];
          storeNotes(notesList);
        });
      document
        .querySelector(".note-text")
        .addEventListener("change", (event) => {
          // eslint-disable-next-line no-param-reassign
          event.target.innerText = event.target.value;
          notesList = [...mainTasks.childNodes];
          storeNotes(notesList);
        });
      // delete note
      document
        .querySelector(".main-notes")
        .addEventListener("click", (event) => {
          if (event.target.classList[0] === "delete-note") {
            deleteNote(event, notesList);
            storeNotes(notesList);
          }
        });
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

// create a note
document.querySelector(".submit-note-btn").addEventListener("click", () => {
  removeChildren(mainTasks);
  notesList.push(notesFactory());
  appendChildren(mainTasks, notesList);
  storeNotes(notesList);
  if (!(mainTasks.classList[1] === "main-notes")) {
    mainTasks.classList.toggle("main-notes");
  }
  bgForm.style.display = "none";
});
