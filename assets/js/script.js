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

    if (!taskList) return;
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






/* ========================================
   WEATHER DASHBOARD
======================================== */

const cityInput = document.getElementById("city-input");
const searchWeatherButton = document.getElementById("search-weather");
const weatherMessage = document.getElementById("weather-message");
const weatherResult = document.getElementById("weather-result");

const cityName = document.getElementById("city-name");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");
const weatherCondition = document.getElementById("weather-condition");


async function getWeather() {

    const city = cityInput.value.trim();


    if (city === "") {

        weatherMessage.textContent =
            "Please enter a city name.";

        weatherResult.hidden = true;

        return;

    }


    weatherMessage.textContent =
        "Searching for weather...";


    weatherResult.hidden = true;


    try {

        /* ========================================
           STEP 1: FIND CITY COORDINATES
        ======================================== */

        const locationResponse = await fetch(

            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`

        );


        if (!locationResponse.ok) {

            throw new Error(
                "Unable to connect to the location service."
            );

        }


        const locationData =
            await locationResponse.json();


        if (
            !locationData.results ||
            locationData.results.length === 0
        ) {

            throw new Error(
                "City not found. Please try again."
            );

        }


        const location =
            locationData.results[0];


        const latitude =
            location.latitude;

        const longitude =
            location.longitude;


        /* ========================================
           STEP 2: FETCH WEATHER DATA
        ======================================== */

        const weatherResponse = await fetch(

            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`

        );


        if (!weatherResponse.ok) {

            throw new Error(
                "Unable to retrieve weather data."
            );

        }


        const weatherData =
            await weatherResponse.json();


        /* ========================================
           STEP 3: EXTRACT JSON DATA
        ======================================== */

        const currentWeather =
            weatherData.current;


        /* ========================================
           STEP 4: DISPLAY WEATHER DATA
        ======================================== */

        cityName.textContent =
            `${location.name}, ${location.country}`;


        temperature.textContent =
            `${currentWeather.temperature_2m} °C`;


        humidity.textContent =
            `${currentWeather.relative_humidity_2m} %`;


        windSpeed.textContent =
            `${currentWeather.wind_speed_10m} km/h`;


        weatherCondition.textContent =
            getWeatherDescription(
                currentWeather.weather_code
            );


        weatherMessage.textContent = "";


        weatherResult.hidden = false;


    } catch (error) {

        weatherMessage.textContent =
            error.message;


        weatherResult.hidden = true;

    }

}


/* ========================================
   WEATHER CODE DESCRIPTIONS
======================================== */

function getWeatherDescription(code) {

    const weatherCodes = {

        0: "Clear sky",

        1: "Mainly clear",

        2: "Partly cloudy",

        3: "Overcast",

        45: "Fog",

        48: "Depositing rime fog",

        51: "Light drizzle",

        53: "Moderate drizzle",

        55: "Heavy drizzle",

        61: "Slight rain",

        63: "Moderate rain",

        65: "Heavy rain",

        71: "Slight snow",

        73: "Moderate snow",

        75: "Heavy snow",

        80: "Rain showers",

        81: "Moderate rain showers",

        82: "Violent rain showers",

        95: "Thunderstorm"

    };


    return weatherCodes[code] ||
        "Unknown weather condition";

}


/* ========================================
   SEARCH BUTTON EVENT
======================================== */

if (searchWeatherButton) {

    searchWeatherButton.addEventListener(
        "click",
        getWeather
    );

}


/* ========================================
   ENTER KEY EVENT
======================================== */

if (cityInput) {

    cityInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                getWeather();

            }

        }
    );

}
