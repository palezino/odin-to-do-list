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
    const checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');
    const checkmark = createNewElement('span', 'checkmark');
    taskTitleChildren.push(checkbox);
    taskTitleChildren.push(checkmark);
    appendChildren(taskChildren[1], taskTitleChildren);

    const editImg = document.createElement('img');
    editImg.setAttribute('src', './images/edit-3.svg');
    editImg.setAttribute('alt', 'edit');
    taskChildren[3].appendChild(editImg);

    const deleteImg = document.createElement('img');
    deleteImg.setAttribute('src', './images/x-square.svg');
    deleteImg.setAttribute('alt', 'delete');
    taskChildren[4].appendChild(deleteImg);

    appendChildren(task, taskChildren);

    return task;
}

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


const sidebarList = document.querySelector('.sidebar-list');

// console.log(sidebarLinks[0].innerText)

sidebarList.addEventListener('click', (e) => {
    console.log(e.target.text);
    if (e.target.text === 'Home') {
        mainTasks.appendChild(tasksFactory('Privet'));
    }
})

// display the date in the header

const today = fns.format(new Date(), 'EEEE, MMM d');
const dateDisplay = document.querySelector('.today-date');

dateDisplay.innerText = today;