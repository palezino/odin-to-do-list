const fns = require('date-fns');


console.log('hello');

// create and display tasks

const mainTasks = document.querySelector('.main-tasks');

const createNewElement = (element, className, text=null) => {
    const newElement = document.createElement(element);
    newElement.classList.add(className);
    newElement.innerText = text;
    return newElement;
}

const appendChildren = (parent, children) => {
    children.forEach(child => {
        parent.appendChild(child);
    });
}

const tasksFactory = (name, dueDate=null, priority=null, description=null) => {
    const task = createNewElement('div', 'task');
    const taskChildren = [
        createNewElement('div', 'task-priority'),
        createNewElement('label', 'task-title', name),
        createNewElement('div', 'task-date'),
        createNewElement('div', 'task-edit'),
        createNewElement('div', 'task-delete')
    ];

    const taskTitleChildren = [];
    // checkbox element
    const checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');
    const checkmark = createNewElement('span', 'checkmark');
    taskTitleChildren.push(checkbox);
    taskTitleChildren.push(checkmark);
    appendChildren(taskChildren[1], taskTitleChildren);
    // date
    

    // edit icon
    const editImg = document.createElement('img');
    editImg.setAttribute('src', './images/edit-3.svg');
    editImg.setAttribute('alt', 'edit');
    taskChildren[3].appendChild(editImg);
    // delete icon
    const deleteImg = document.createElement('img');
    deleteImg.setAttribute('src', './images/x-square.svg');
    deleteImg.setAttribute('alt', 'delete');
    taskChildren[4].appendChild(deleteImg);

    appendChildren(task, taskChildren);

    return task;
}

// create and display notes
const notesFactory = (title, text=null) => {
    const note = createNewElement('div', 'note');
    const noteChildren = [
        createNewElement('img', 'delete-note'),
        createNewElement('h4', 'note-title', title),
        createNewElement('p', 'note-text', text)
    ];

    noteChildren[0].setAttribute('src', './images/x.svg');
    noteChildren[0].setAttribute('alt', 'delete-note');

    appendChildren(note, noteChildren);

    return note;
}

// // a template to make links work
// const sidebarList = document.querySelector('.sidebar-list');

// sidebarList.addEventListener('click', (e) => {
//     console.log(e.target.text);
//     if (e.target.text === 'Home') {
//         mainTasks.appendChild(tasksFactory('Privet'));
//     }
// })

// display the date in the header
const today = fns.format(new Date(), 'EEEE, MMM d');
const dateDisplay = document.querySelector('.today-date');

dateDisplay.innerText = today;

// open and close pop-up form
const plusBtn = document.querySelector('.plus-btn');

plusBtn.addEventListener('click', () => {
    document.querySelector('.bg-form').style.display = 'flex';
    document.querySelector('.todo-form').style = "transform: scale(1.1); font-weight: 700;";
})

const bgForm = document.querySelector('.bg-form');

bgForm.addEventListener('click', (e) => {
    // console.log(e.target.className);
    if (e.target.className === 'bg-form' || e.target.className === "close-form") {
        bgForm.style.display = 'none';
    }
})

bgForm.addEventListener('keydown', (e) => {
    // console.log(e.keyCode);
    if (e.keyCode === 27) {
        bgForm.style.display = 'none';
    }
})



// working links in pop-up form
const sidebarListForm = document.querySelector('.sidebar-list-form');

sidebarListForm.addEventListener('click', (e) => {
    // console.log(e.target.textContent);
    if (e.target.textContent === 'TO-DO') {
        document.querySelector('.note-form').style = "transform: scale(1); font-weight: 400;";
        document.querySelector('.new-note-form').style.display = 'none';
        document.querySelector('.new-task-form').style.display = 'flex';
        document.querySelector('.todo-form').style = "transform: scale(1.1); font-weight: 700;";
    } 
    if (e.target.textContent === 'Note') {
        document.querySelector('.todo-form').style = "transform: scale(1); font-weight: 400;";
        document.querySelector('.new-task-form').style.display = 'none';
        document.querySelector('.new-note-form').style.display = 'flex';
        document.querySelector('.note-form').style = "transform: scale(1.1); font-weight: 700;";
    }
})