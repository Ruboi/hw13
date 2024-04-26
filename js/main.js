// 1) Написати шаблон регулярного виразу, який приймає ім'я файлу зображення.
// можливі формати зображення: png, jpg.
// що може бути ім'м файлу - дивимося в ОС

// Регулярний вираз для png
const pngRegex = /^[a-zA-Z0-9_-]+\.png$/;
// Регулярний вираз для jpg
const jpgRegex = /^[a-zA-Z0-9_-]+\.jpg$/;



// 2) Реалізувати TODO
// У формі вводимо Завдання (рядок довжиною від 3 до 40 символів: букви, цифри і пробіл), Виконавця (один з переліку: дизайнер, розробник, тестувальник) та термін виконання (дата в майбутньому або сьогодні)
// Завдання зберігаємо в Window.localStorage

// Отримуємо елементи форми
const form = document.querySelector('form');
const taskInput = document.querySelector('#task');
const workerInput = document.querySelector('#worker');
const deadlineInput = document.querySelector('#deadline');
const taskList = document.querySelector('#task-list');
const doneCount = document.querySelector('#done-count');
const undoneCount = document.querySelector('#undone-count');
const totalCount = document.querySelector('#total-count');

// Функція для виводу списку завдань
function renderTasks() {
    // Очищаємо список завдань перед виведенням
    taskList.innerHTML = '';

    // Отримуємо завдання з localStorage
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Змінні для підрахунку кількості виконаних та невиконаних завдань
    let done = 0;
    let undone = 0;

    // Проходимось по кожному завданню
    tasks.forEach(task => {
        // Створюємо елемент списку для завдання
        const li = document.createElement('li');
        li.textContent = `${task.body} (${task.worker}, ${task.data})`;
        if (task.isDone) {
            li.classList.add("done");
            done++;
        } else {
            const today = new Date().toISOString().split('T')[0];
            if (task.data < today) {
                li.style.background = 'red';
            }
            undone++;
        }
        // Додаємо кнопки для відмітки виконаного, редагування та видалення завдання
        const wrpBtn = document.createElement('div');
        wrpBtn.classList.add("wrp-btn");
        
        const doneBtn = document.createElement('button');
        doneBtn.textContent = '✔️';
        doneBtn.onclick = () => {
            task.isDone = !task.isDone;
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTasks();
        };
        const editBtn = document.createElement('button');
        editBtn.textContent = '✏️';
        editBtn.onclick = () => {
            editTask(task);
        };
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '❌';
        deleteBtn.onclick = () => {
            const index = tasks.indexOf(task);
            tasks.splice(index, 1);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTasks();
        };

        // Додаємо кнопки до елементу списку
        li.appendChild(wrpBtn);
        wrpBtn.appendChild(doneBtn);
        wrpBtn.appendChild(editBtn);
        wrpBtn.appendChild(deleteBtn);

        // Додаємо елемент списку до DOM
        taskList.appendChild(li);
    });

    // Оновлюємо кількості виконаних, невиконаних та загальних завдань
    doneCount.textContent = done;
    undoneCount.textContent = undone;
    totalCount.textContent = tasks.length;
}

// Функція для редагування завдання
function editTask(task) {
    const newBody = prompt('Enter new task:', task.body);
    const newWorker = prompt('Enter new worker:', task.worker);
    const newDeadline = prompt('Enter new deadline (YYYY-MM-DD):', task.data);

    // Перевірка на валідність введених даних
    if (
        newBody && newBody.length >= 3 && newBody.length <= 40 &&
        newWorker && ['designer', 'developer', 'tester'].includes(newWorker) &&
        newDeadline && new Date(newDeadline) >= new Date().setHours(0, 0, 0, 0)
    ) {
        task.body = newBody;
        task.worker = newWorker;
        task.data = newDeadline;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    } else {
        alert('Invalid input.');
    }
}

// Обробник подання форми
form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Отримуємо значення з полів введення
    const task = taskInput.value.trim();
    const worker = workerInput.value;
    const deadline = deadlineInput.value;

    const taskRe = /^[a-zA-Z][a-zA-Z0-9-_\.]{2,40}$/;

    // Перевірка на валідність введених даних
    if (task.length < 3 || task.length > 40) {
        alert('Task must be between 3 and 40 characters long.');
        return;
    }
    if (!['designer', 'developer', 'tester'].includes(worker)) {
        alert('Invalid worker.');
        return;
    }
    if (new Date(deadline) < new Date().setHours(0, 0, 0, 0)) {
        alert('Deadline must be today or in the future.');
        return;
    }

    // Отримуємо завдання з localStorage
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Додаємо нове завдання до списку
    tasks.push({
        id: tasks.length + 1,
        body: task,
        isDone: false,
        worker: worker,
        data: deadline
    });

    // Зберігаємо оновлений список завдань у localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));

    // Очищаємо поля вводу
    taskInput.value = '';
    workerInput.value = '';
    deadlineInput.value = '';

    // Оновлюємо вивід списку завдань
    renderTasks();
});

// Виведення списку завдань при завантаженні сторінки
renderTasks();

