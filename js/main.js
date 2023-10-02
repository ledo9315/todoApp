const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];

if(localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach(function (task) {
        renderTask(task);
    })
}

form.addEventListener('submit', addTask);
tasksList.addEventListener('click', removeTask);
tasksList.addEventListener('click', doneTask);
checkEmptyList();



function addTask(event) {
    event.preventDefault(); 

    const taskText = taskInput.value.trim();

    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false
    };

    tasks.push(newTask);
    
    renderTask(newTask);
    
    taskInput.value = '';
    taskInput.focus();
    checkEmptyList();
    saveToLocalStorage();
}
function removeTask(event) {
//durch return wird die Funktion sofort beendet
if(event.target.dataset.action !== 'delete') return;
    const parentNode = event.target.closest('.list-group-item');
    const id = Number(parentNode.id);

    tasks = tasks.filter((task) => task.id !== id);

    parentNode.remove();
    checkEmptyList();
    saveToLocalStorage();
}
function doneTask(event) {
//durch return wird die Funktion sofort beendet    
    if(event.target.dataset.action !== 'done') return

    if(event.target.dataset.action === 'done') {
        const parentNode = event.target.closest('.list-group-item');

        const id = Number(parentNode.id);

        const task = tasks.find(function (task) {
            if(task.id === id) {
                return true;
            }
        })

        task.done = !task.done;

        const taskTitle = parentNode.querySelector('.task-title');
        taskTitle.classList.toggle('task-title--done');
    }
    saveToLocalStorage();
}
function checkEmptyList() {
    if(tasks.length === 0) {
        const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
        <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3" />
        <div class="empty-list__title">Die Liste ist Leer</div>
        </li`
        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML)
    }
    if(tasks.length > 0) {
        const emptyListEl = document.querySelector('#emptyList')
        emptyListEl ? emptyListEl.remove() : null;
    }
}
function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
function renderTask(task) {
    const cssClass = task.done ? 'task-title task-title--done' : 'task-title';

    const taskHTML = `
    <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
        <span class="${cssClass}">${task.text}</span>
        <div class="task-item__buttons">
            <button type="button" data-action="done" class="btn-action">
                <img src="./img/tick.svg" alt="Erledigt" width="18" height="18">
            </button>
            <button type="button" data-action="delete" class="btn-action">
                <img src="./img/cross.svg" alt="Löschen" width="18" height="18">
            </button>
        </div>
    </li>`;

    tasksList.insertAdjacentHTML('beforeend', taskHTML);
}