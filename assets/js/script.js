/* =================================
   LIGHT / DARK MODE TOGGLE
   ================================= */

const themeToggle = document.getElementById("theme-toggle");

if (themeToggle) {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
        themeToggle.textContent = "☀️ Light Mode";
        themeToggle.setAttribute("aria-label", "Switch to light mode");
        themeToggle.setAttribute("aria-pressed", "true");
    }

    themeToggle.addEventListener("click", () => {
        const isDark =
            document.documentElement.getAttribute("data-theme") === "dark";

        if (isDark) {
            document.documentElement.removeAttribute("data-theme");
            localStorage.setItem("theme", "light");

            themeToggle.textContent = "🌙 Dark Mode";
            themeToggle.setAttribute("aria-label", "Switch to dark mode");
            themeToggle.setAttribute("aria-pressed", "false");
        } else {
            document.documentElement.setAttribute("data-theme", "dark");
            localStorage.setItem("theme", "dark");

            themeToggle.textContent = "☀️ Light Mode";
            themeToggle.setAttribute("aria-label", "Switch to light mode");
            themeToggle.setAttribute("aria-pressed", "true");
        }
    });
}
/* =========================================
   TO-DO LIST APPLICATION
   ========================================= */

const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const todoCount = document.getElementById("todo-count");
const emptyState = document.getElementById("empty-state");
const filterButtons = document.querySelectorAll(".filter-button");

if (todoForm && todoInput && todoList) {

    let tasks = JSON.parse(localStorage.getItem("todoTasks")) || [];
    let currentFilter = "all";

    function saveTasks() {
        localStorage.setItem("todoTasks", JSON.stringify(tasks));
    }

    function createTask(text) {
        return {
            id: Date.now().toString(),
            text: text,
            completed: false
        };
    }

    function getFilteredTasks() {

        if (currentFilter === "active") {
            return tasks.filter(task => !task.completed);
        }

        if (currentFilter === "completed") {
            return tasks.filter(task => task.completed);
        }

        return tasks;
    }

    function renderTasks() {

        todoList.innerHTML = "";

        const filteredTasks = getFilteredTasks();

        filteredTasks.forEach(task => {

            const li = document.createElement("li");

            li.className = "todo-item";
            li.dataset.id = task.id;

            li.innerHTML = `
                <label class="todo-task">
                    <input
                        type="checkbox"
                        data-action="toggle"
                        ${task.completed ? "checked" : ""}
                    >

                    <span class="${task.completed ? "completed" : ""}">
                        ${escapeHTML(task.text)}
                    </span>
                </label>

                <div class="todo-actions">
                    <button
                        type="button"
                        data-action="edit"
                        aria-label="Edit task"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        data-action="delete"
                        aria-label="Delete task"
                    >
                        Delete
                    </button>
                </div>
            `;

            todoList.appendChild(li);
        });

        updateCount(filteredTasks.length);

        emptyState.hidden = filteredTasks.length !== 0;
    }

    function updateCount(count) {

        todoCount.textContent =
            `${count} ${count === 1 ? "task" : "tasks"}`;
    }

    function escapeHTML(text) {

        const div = document.createElement("div");

        div.textContent = text;

        return div.innerHTML;
    }

    /* CREATE */

    todoForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const text = todoInput.value.trim();

        if (!text) {
            return;
        }

        const newTask = createTask(text);

        tasks.push(newTask);

        saveTasks();

        todoInput.value = "";

        renderTasks();

        todoInput.focus();
    });

    /* UPDATE + DELETE + TOGGLE
       Event delegation
    */

    todoList.addEventListener("click", function (event) {

        const button = event.target.closest("button");

        if (!button) {
            return;
        }

        const taskItem = button.closest(".todo-item");

        if (!taskItem) {
            return;
        }

        const taskId = taskItem.dataset.id;

        const task = tasks.find(task => task.id === taskId);

        if (!task) {
            return;
        }

        const action = button.dataset.action;

        /* UPDATE */

        if (action === "edit") {

            const updatedText = prompt(
                "Edit your task:",
                task.text
            );

            if (updatedText === null) {
                return;
            }

            const cleanText = updatedText.trim();

            if (!cleanText) {
                return;
            }

            task.text = cleanText;

            saveTasks();

            renderTasks();
        }

        /* DELETE */

        if (action === "delete") {

            tasks = tasks.filter(
                task => task.id !== taskId
            );

            saveTasks();

            renderTasks();
        }
    });

    /* TOGGLE COMPLETED */

    todoList.addEventListener("change", function (event) {

        if (!event.target.matches('[data-action="toggle"]')) {
            return;
        }

        const taskItem = event.target.closest(".todo-item");

        const taskId = taskItem.dataset.id;

        const task = tasks.find(task => task.id === taskId);

        if (!task) {
            return;
        }

        task.completed = event.target.checked;

        saveTasks();

        renderTasks();
    });

    /* FILTER */

    filterButtons.forEach(button => {

        button.addEventListener("click", function () {

            currentFilter = button.dataset.filter;

            filterButtons.forEach(filterButton => {

                const isActive =
                    filterButton === button;

                filterButton.classList.toggle(
                    "active",
                    isActive
                );

                filterButton.setAttribute(
                    "aria-pressed",
                    String(isActive)
                );
            });

            renderTasks();
        });
    });

    renderTasks();
}
