const taskInput = document.getElementById('taskInput');
const addButton = document.getElementById('addButton');
const taskList = document.getElementById('taskList');
const successMessage = document.getElementById('successMessage');
const registerBtn = document.getElementById('registerBtn');
const listBtn = document.getElementById('listBtn');
const registerView = document.getElementById('registerView');
const listView = document.getElementById('listView');
const sortSelect = document.getElementById('sortSelect');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
}

function createTaskElement(task, index) {
    const li = document.createElement('li');
    li.className = 'task-item';
    if (task.completed) {
        li.classList.add('completed');
    }

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => {
        tasks[index].completed = checkbox.checked;
        tasks[index].updatedAt = new Date().toISOString();
        saveTasks();
        renderTasks();
    });

    const taskMetadata = document.createElement('div');
    taskMetadata.className = 'task-metadata';

    const taskText = document.createElement('span');
    taskText.className = 'task-text';
    taskText.textContent = task.text;

    const taskDates = document.createElement('div');
    taskDates.className = 'task-dates';
    taskDates.innerHTML = `
        登録: ${formatDate(task.createdAt)}
        ${task.updatedAt ? `<br>更新: ${formatDate(task.updatedAt)}` : ''}
    `;

    taskMetadata.appendChild(taskText);
    taskMetadata.appendChild(taskDates);

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.textContent = '削除';
    deleteButton.addEventListener('click', () => {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    });

    li.appendChild(checkbox);
    li.appendChild(taskMetadata);
    li.appendChild(deleteButton);

    return li;
}

function sortTasks() {
    const sortValue = sortSelect.value;
    const tasksCopy = [...tasks];

    switch(sortValue) {
        case 'created-desc':
            tasksCopy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
        case 'created-asc':
            tasksCopy.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            break;
        case 'updated-desc':
            tasksCopy.sort((a, b) => {
                const dateA = a.updatedAt || a.createdAt;
                const dateB = b.updatedAt || b.createdAt;
                return new Date(dateB) - new Date(dateA);
            });
            break;
        case 'updated-asc':
            tasksCopy.sort((a, b) => {
                const dateA = a.updatedAt || a.createdAt;
                const dateB = b.updatedAt || b.createdAt;
                return new Date(dateA) - new Date(dateB);
            });
            break;
    }

    return tasksCopy;
}

function renderTasks() {
    taskList.innerHTML = '';
    const sortedTasks = sortTasks();
    
    sortedTasks.forEach((task) => {
        const originalIndex = tasks.findIndex(t => t === task);
        const taskElement = createTaskElement(task, originalIndex);
        taskList.appendChild(taskElement);
    });
}

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') {
        return;
    }

    tasks.push({
        text: taskText,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: null
    });

    saveTasks();
    taskInput.value = '';
    
    successMessage.style.display = 'block';
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 2000);
}

function showRegisterView() {
    registerView.style.display = 'block';
    listView.style.display = 'none';
    registerBtn.classList.add('active');
    listBtn.classList.remove('active');
}

function showListView() {
    registerView.style.display = 'none';
    listView.style.display = 'block';
    registerBtn.classList.remove('active');
    listBtn.classList.add('active');
    renderTasks();
}

addButton.addEventListener('click', addTask);

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

registerBtn.addEventListener('click', showRegisterView);
listBtn.addEventListener('click', showListView);
sortSelect.addEventListener('change', renderTasks);

showRegisterView();