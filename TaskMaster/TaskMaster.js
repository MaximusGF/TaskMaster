document.addEventListener("DOMContentLoaded", () => {
    const taskForm = document.getElementById('task-form');
    const todoList = document.getElementById('todo-list');
    const completedList = document.getElementById('completed-list');
    const tasks = [];

    // Variáveis para o calendário
    const calendarElement = document.getElementById('calendar');
    const monthYearElement = document.getElementById('month-year');
    const prevMonthButton = document.getElementById('prev-month');
    const nextMonthButton = document.getElementById('next-month');
    let currentDate = new Date();

    // Adicionar tarefa
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskName = document.getElementById('task-name').value;
        const taskDate = document.getElementById('task-date').value;
        const taskTime = document.getElementById('task-time').value; // Novo campo

        const task = {
            id: Date.now(),
            name: taskName,
            date: taskDate,
            time: taskTime, // Adicione o horário ao objeto da tarefa
            completed: false
        };

        tasks.push(task);
        renderTasks();
        taskForm.reset();
    });

    // Renderizar tarefas nas colunas
    function renderTasks() {
        todoList.innerHTML = '';
        completedList.innerHTML = '';

        tasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.innerHTML = `
                <span class="${task.completed ? 'completed' : ''}">${task.name} - ${task.date} ${task.time}</span>
                <div>
                    <button class="complete-btn">${task.completed ? 'Reativar' : 'Concluir'}</button>
                    <button class="edit-btn">Editar</button>
                    <button class="delete-btn">Excluir</button>
                </div>
            `;

            taskItem.querySelector('.complete-btn').addEventListener('click', () => {
                task.completed = !task.completed;
                renderTasks();
            });

            taskItem.querySelector('.edit-btn').addEventListener('click', () => {
                document.getElementById('task-name').value = task.name;
                document.getElementById('task-date').value = task.date;
                document.getElementById('task-time').value = task.time; // Adicione o horário ao campo
                const taskIndex = tasks.findIndex(t => t.id === task.id);
                tasks.splice(taskIndex, 1);
                renderTasks();
            });

            taskItem.querySelector('.delete-btn').addEventListener('click', () => {
                const taskIndex = tasks.findIndex(t => t.id === task.id);
                tasks.splice(taskIndex, 1);
                renderTasks();
            });

            if (task.completed) {
                completedList.appendChild(taskItem);
            } else {
                todoList.appendChild(taskItem);
            }
        });
    }

    // Filtros no menu lateral
    document.getElementById('all-tasks').addEventListener('click', () => {
        renderTasks();
    });

    document.getElementById('open-tasks').addEventListener('click', () => {
        const openTasks = tasks.filter(task => !task.completed);
        renderFilteredTasks(openTasks);
    });

    document.getElementById('completed-tasks').addEventListener('click', () => {
        const completedTasks = tasks.filter(task => task.completed);
        renderFilteredTasks(completedTasks);
    });

    function renderFilteredTasks(filteredTasks) {
        todoList.innerHTML = '';
        completedList.innerHTML = '';

        filteredTasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.innerHTML = `
                <span class="${task.completed ? 'completed' : ''}">${task.name} - ${task.date} ${task.time}</span>
                <div>
                    <button class="complete-btn">${task.completed ? 'Reativar' : 'Concluir'}</button>
                    <button class="edit-btn">Editar</button>
                    <button class="delete-btn">Excluir</button>
                </div>
            `;

            if (task.completed) {
                completedList.appendChild(taskItem);
            } else {
                todoList.appendChild(taskItem);
            }
        });
    }

    // Função para renderizar o calendário
    function renderCalendar() {
        calendarElement.innerHTML = '';
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        monthYearElement.textContent = `${currentDate.toLocaleString('pt-BR', { month: 'long' })} ${year}`;

        const firstDayOfMonth = new Date(year, month, 1);
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Preencher dias anteriores ao primeiro dia do mês
        for (let i = 0; i < firstDayOfMonth.getDay(); i++) {
            const emptyDay = document.createElement('div');
            emptyDay.classList.add('day', 'empty');
            calendarElement.appendChild(emptyDay);
        }

        // Preencher dias do mês
        for (let i = 1; i <= daysInMonth; i++) {
            const day = document.createElement('div');
            day.classList.add('day');
            day.textContent = i;

            // Marcar tarefas no calendário
            const taskOnDate = tasks.filter(task => {
                const taskDate = new Date(task.date);
                return taskDate.getDate() === i && taskDate.getMonth() === month && taskDate.getFullYear() === year;
            });

            if (taskOnDate.length > 0) {
                day.classList.add('has-task');
                day.title = taskOnDate.map(task => task.name).join(', '); // Tooltip com os nomes das tarefas
            }

            calendarElement.appendChild(day);
        }
    }

    // Navegação entre meses
    prevMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    // Renderizar o calendário inicial
    renderCalendar();
});
