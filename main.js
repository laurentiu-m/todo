const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const tasksList = document.querySelector(".tasks-list");
const taskCounter = document.getElementById("task-counter");
const taskCompletedCounter = document.getElementById("task-completed-counter");

// Storage of all the tasks
const storedTasks = !JSON.parse(localStorage.getItem("tasks"))
  ? []
  : JSON.parse(localStorage.getItem("tasks"));

// Array of completed tasks
const completedTasks = !JSON.parse(localStorage.getItem("completed-tasks"))
  ? Array(storedTasks.length).fill(false)
  : JSON.parse(localStorage.getItem("completed-tasks"));

// Counter of tasks
let countTasks = 0;

// Creates tasks
const createTask = (id, taskValue, classes) => {
  const div = document.createElement("div");
  const submitButton = document.createElement("button");
  const task = document.createElement("p");
  const deleteButton = document.createElement("button");

  div.classList.add("task-container");
  div.setAttribute("data-id", id);
  task.textContent = taskValue;
  deleteButton.classList.add("delete-button");

  if (Array.isArray(classes)) {
    submitButton.classList.add(classes[0]);
    task.classList.add(classes[1]);
  } else {
    submitButton.classList.add(classes);
  }

  div.append(submitButton, task, deleteButton);
  tasksList.appendChild(div);
};

// Checks completed tasks and updates the counter
const taskCompleted = () => {
  let count = 0;
  completedTasks.forEach((task) => {
    if (task) count++;
  });

  if (count === 0) {
    taskCompletedCounter.textContent = "0";
  } else {
    taskCompletedCounter.textContent = `${count} of ${storedTasks.length}`;
  }
};

// Prints all the tasks
const printTasks = () => {
  const length = storedTasks.length;

  for (let i = 0; i < length; i++) {
    createTask(
      i,
      storedTasks[i],
      completedTasks[i]
        ? ["task-completed-button", "task-completed-text"]
        : "submit-button"
    );
  }

  countTasks = length;
  taskCounter.textContent = countTasks;
  taskCompleted();
};

// Print if the task list is empty
const emptyList = () => {
  const div = document.createElement("div");
  const img = document.createElement("img");
  const h3 = document.createElement("h3");
  const p = document.createElement("p");

  div.classList.add("empty");
  img.src = "./styles/clipboard-icon.svg";
  img.alt = "list-icon";
  h3.textContent = "You don't have any tasks yet";
  p.textContent = "Add a task and organize your to-do items";

  div.append(img, h3, p);

  tasksList.appendChild(div);

  countTasks = storedTasks.length;
  taskCounter.textContent = countTasks;
  taskCompleted();
};

// Add the task in storage
const addTaskInStorage = (newTask) => {
  storedTasks.push(newTask);
  localStorage.setItem("tasks", JSON.stringify(storedTasks));

  completedTasks.push(false);
  localStorage.setItem("completed-tasks", JSON.stringify(completedTasks));
};

// Add the task in the list
const addTask = (e) => {
  e.preventDefault();

  const value = input.value;
  if (!value) {
    input.placeholder = "Please enter a task";
    input.classList.add("task-input-error");
    return;
  }

  input.placeholder = "Add a new task";
  input.classList.remove("task-input-error");

  const emptyContainer = tasksList.firstElementChild;
  if (emptyContainer.classList.value === "empty") {
    tasksList.removeChild(emptyContainer);
  }

  addTaskInStorage(value);
  createTask(countTasks, value, "submit-button");

  countTasks++;
  taskCounter.textContent = countTasks;
  taskCompleted();

  input.value = "";
};

const handleButton = (e) => {
  const button = e.target;
  const buttonClass = e.target.classList.value;

  if (buttonClass.length === "" || button.tagName !== "BUTTON") return;

  const task = button.closest(".task-container");
  const taskId = task.getAttribute("data-id");

  if (buttonClass === "delete-button") {
    storedTasks.splice(taskId, 1);
    localStorage.setItem("tasks", JSON.stringify(storedTasks));

    completedTasks.splice(taskId, 1);
    localStorage.setItem("completed-tasks", JSON.stringify(completedTasks));

    tasksList.innerHTML = "";

    if (storedTasks.length === 0) {
      emptyList();
    } else {
      printTasks();
    }
  }

  if (buttonClass === "submit-button") {
    const p = button.nextElementSibling;

    button.classList.remove(buttonClass);
    button.classList.add("task-completed-button");
    p.classList.add("task-completed-text");

    completedTasks[taskId] = true;
    localStorage.setItem("completed-tasks", JSON.stringify(completedTasks));

    taskCompleted();
  }
};

// Check if the task list is empty
if (storedTasks.length === 0) {
  emptyList();
} else {
  printTasks();
}

form.addEventListener("submit", addTask);
tasksList.addEventListener("click", handleButton);
