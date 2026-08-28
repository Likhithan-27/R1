/* ========================================
   LIGHT / DARK MODE TOGGLE
======================================== */

const themeToggle = document.getElementById("theme-toggle");

if (themeToggle) {
    const savedTheme = localStorage.getItem("theme");

    // Load saved theme
    if (savedTheme === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");

        themeToggle.textContent = "☀️ Light Mode";
        themeToggle.setAttribute("aria-label", "Switch to light mode");
        themeToggle.setAttribute("aria-pressed", "true");
    }

    // Toggle theme
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


/* ========================================
   TO-DO LIST - STATE
======================================== */

const taskInput = document.getElementById("todo-input");
const addTaskButton = document.getElementById("add-task");
const taskList = document.getElementById("todo-list");
const emptyMessage = document.getElementById("empty-message");
const todoForm = document.getElementById("todo-form");

const filterButtons = document.querySelectorAll("[data-filter]");


// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


// Current filter
let currentFilter = "all";


/* ========================================
   SAVE TASKS
======================================== */

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


/* ========================================
   RENDER TASKS
======================================== */

function renderTasks() {

    // Clear current tasks
    taskList.innerHTML = "";

    let filteredTasks = tasks;


    // Active tasks
    if (currentFilter === "active") {
        filteredTasks = tasks.filter(task => !task.completed);
    }


    // Completed tasks
    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }


    // Show empty message
    if (filteredTasks.length === 0) {

        if (emptyMessage) {
            emptyMessage.hidden = false;
        }

        return;
    }


    // Hide empty message
    if (emptyMessage) {
        emptyMessage.hidden = true;
    }


    // Create task elements
    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.className = "task-item";

        li.dataset.id = task.id;


        li.innerHTML = `
            <input
                type="checkbox"
                class="task-checkbox"
                ${task.completed ? "checked" : ""}
                aria-label="Mark task as completed"
            >

            <span class="task-text ${task.completed ? "completed" : ""}">
                ${escapeHTML(task.text)}
            </span>

            <button
                type="button"
                class="edit-task"
                aria-label="Edit task"
            >
                Edit
            </button>

            <button
                type="button"
                class="delete-task"
                aria-label="Delete task"
            >
                Delete
            </button>
        `;


        taskList.appendChild(li);
    });
}


/* ========================================
   ADD TASK
======================================== */

function addTask() {

    const text = taskInput.value.trim();


    // Do nothing if input is empty
    if (text === "") {
        taskInput.focus();
        return;
    }


    // Create new task
    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };


    // Add task to array
    tasks.push(newTask);


    // Save tasks
    saveTasks();


    // Update screen
    renderTasks();


    // Clear input
    taskInput.value = "";


    // Focus input again
    taskInput.focus();
}


/* ========================================
   ADD TASK BUTTON
======================================== */

if (addTaskButton) {

    addTaskButton.addEventListener("click", () => {
        addTask();
    });
}


/* ========================================
   FORM SUBMIT
======================================== */

if (todoForm) {

    todoForm.addEventListener("submit", event => {

        event.preventDefault();

        addTask();
    });
}


/* ========================================
   ENTER KEY
======================================== */

if (taskInput) {

    taskInput.addEventListener("keydown", event => {

        if (event.key === "Enter") {

            event.preventDefault();

            addTask();
        }
    });
}


/* ========================================
   TASK ACTIONS
   COMPLETE / EDIT / DELETE
======================================== */

if (taskList) {

    taskList.addEventListener("click", event => {

        const taskItem = event.target.closest(".task-item");


        // If task item does not exist
        if (!taskItem) {
            return;
        }


        const taskId = Number(taskItem.dataset.id);


        /* ============================
           COMPLETE TASK
        ============================ */

        if (event.target.classList.contains("task-checkbox")) {

            tasks = tasks.map(task => {

                if (task.id === taskId) {

                    return {
                        ...task,
                        completed: event.target.checked
                    };
                }

                return task;
            });


            saveTasks();

            renderTasks();

            return;
        }


        /* ============================
           DELETE TASK
        ============================ */

        if (event.target.classList.contains("delete-task")) {

            tasks = tasks.filter(task => task.id !== taskId);


            saveTasks();

            renderTasks();

            return;
        }


        /* ============================
           EDIT TASK
        ============================ */

        if (event.target.classList.contains("edit-task")) {

            const task = tasks.find(task => task.id === taskId);


            if (!task) {
                return;
            }


            const updatedText = prompt(
                "Edit your task:",
                task.text
            );


            // If user clicks Cancel
            if (updatedText === null) {
                return;
            }


            const trimmedText = updatedText.trim();


            // Don't allow empty task
            if (trimmedText === "") {
                return;
            }


            // Update task
            task.text = trimmedText;


            saveTasks();

            renderTasks();
        }
    });
}


/* ========================================
   FILTER BUTTONS
======================================== */

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        // Get selected filter
        currentFilter = button.dataset.filter;


        // Remove active state
        filterButtons.forEach(btn => {

            btn.removeAttribute("aria-current");

            btn.classList.remove("active");
        });


        // Add active state
        button.setAttribute("aria-current", "true");

        button.classList.add("active");


        // Render filtered tasks
        renderTasks();
    });
});


/* ========================================
   ESCAPE HTML
   Prevents HTML from being inserted
======================================== */

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


/* ========================================
   INITIAL RENDER
======================================== */

renderTasks();
