import { $taskInput, $addButton, $taskList } from "./elements.js";
import {
  showToastMessage,
  createTaskElement,
  sanitizeInput,
  formatDate,
} from "./utilities.js";

let tasks = [];

const addButtonHandler = () => {
  const taskTitle = sanitizeInput($taskInput.value);
  if (taskTitle) {
    createTask(taskTitle);
    showToastMessage("Task added successfully!");
    $addButton.disabled = true;
  } else {
    showToastMessage("Please provide a valid title!");
  }
};

const deleteTask = (taskId) => {
  tasks = tasks.filter((task) => task.id !== taskId);
  renderTasks();
};

const editTask = (task) => {
  cancelEdit();
  task.isEditing = true;
  renderTasks();
};

const updateTask = (task, newTitle) => {
  if (newTitle) {
    task.title = newTitle;
  }
  cancelEdit();
  renderTasks();
};

const completeTask = (taskId) => {
  const task = tasks.find((task) => task.id === taskId);
  if (task) {
    task.done = true;
    renderTasks();
  }
};

const createTask = (taskTitle) => {
  const task = {
    id: new Date().getTime(),
    title: taskTitle,
    createdAt: formatDate(new Date()),
  };
  tasks.unshift(task);
  renderTasks();
  $taskInput.value = "";
};

const renderTasks = () => {
  $taskList.innerHTML = "";

  tasks.forEach((task) => {
    const $taskElement = createTaskElement(
      task,
      deleteTask,
      editTask,
      updateTask,
      cancelEdit,
      completeTask
    );
    $taskList.appendChild($taskElement);
  });
};

const cancelEdit = () => {
  tasks.forEach((task) => (task.isEditing = false));
  renderTasks();
};

$taskInput.addEventListener("input", () => {
  if ($taskInput.value.trim()) {
    $addButton.disabled = false;
  } else {
    $addButton.disabled = true;
  }
});

$addButton.addEventListener("click", addButtonHandler);
