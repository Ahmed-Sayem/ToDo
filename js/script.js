import {
  $mainContainer,
  $searchInput,
  $searchButton,
  $splash,
  $noTask,
  $taskListContainer,
  $loadMore,
  $createButton,
} from "./elements.js";
import {
  showToastMessage,
  sanitizeInput,
  toggleInputContainer,
  containerBuilder,
  showSpinnerOverlay,
  hideSpinnerOverlay,
  formatDate,
} from "./utilities.js";
import { MESSAGES } from "./const.js";

let tasks = [];
let isVisible = false;

const addButtonHandler = (container) => {
  isVisible = !isVisible;
  const taskTitle = sanitizeInput(document.getElementById("task-input").value);

  if (taskTitle) {
    const $overlay = showSpinnerOverlay(container);
    setTimeout(() => {
      createTask(taskTitle);
      showToastMessage(MESSAGES.SUCCESS, true);
      hideSpinnerOverlay($overlay);
    }, 1000);
  } else {
    showToastMessage(MESSAGES.ERROR, false);
  }
};

const createButtonHandler = () => {
  isVisible = !isVisible;
  $taskListContainer.style.display = "grid";
  $noTask.style.display = "none";

  toggleInputContainer(isVisible, addButtonHandler);
  if (!isVisible) renderTasks(tasks);
};

const searchButtonHandler = () => {
  const searchTitle = sanitizeInput($searchInput.value);
  const $overlay = showSpinnerOverlay($taskListContainer);

  setTimeout(() => {
    if (searchTitle) {
      const filteredTasks = tasks.filter((task) =>
        task.title.toLowerCase().includes(searchTitle.toLowerCase())
      );
      if (filteredTasks.length > 0) {
        renderTasks(filteredTasks);
      } else {
        showToastMessage(MESSAGES.NO_TASKS_FOUND);
      }
    } else {
      renderTasks(tasks);
    }

    hideSpinnerOverlay($overlay);
    $searchInput.value = "";
  }, 1000);
};

const deleteTask = (taskId, container) => {
  const $overlay = showSpinnerOverlay(container);
  setTimeout(() => {
    tasks = tasks.filter((task) => task.id !== taskId);
    renderTasks(tasks);
    hideSpinnerOverlay($overlay);
  }, 1000);
};

const editTask = (task) => {
  cancelEdit();
  task.editMode = true;
  renderTasks(tasks);
};

const updateTask = (task, container, newTitle) => {
  if (newTitle) {
    const $overlay = showSpinnerOverlay(container);
    setTimeout(() => {
      task.title = newTitle;
      task.editMode = false;
      renderTasks(tasks);
      hideSpinnerOverlay($overlay);
    }, 1000);
  }
};

const doneTask = (taskId, container) => {
  const $overlay = showSpinnerOverlay(container);
  setTimeout(() => {
    const task = tasks.find((task) => task.id === taskId);
    if (task) {
      task.done = !task.done;
      renderTasks(tasks);
    }
    hideSpinnerOverlay($overlay);
  }, 1000);
};

const createTask = (taskTitle) => {
  const task = {
    id: new Date().getTime(),
    title: taskTitle,
    createdAt: formatDate(new Date()),
    editMode: false,
    done: false,
  };
  tasks.unshift(task);
  renderTasks(tasks);
};

const renderTasks = (tasksToRender = tasks) => {
  $taskListContainer.innerHTML = "";
  tasksToRender.forEach((task) => {
    containerBuilder(task, doneTask, editTask, deleteTask, updateTask);
  });

  if (tasksToRender.length === 0) {
    $noTask.style.display = "flex";
  } else {
    $noTask.style.display = "none";
  }
};

const renderNoTasks = () => {
  $taskListContainer.style.display = "none";
  $loadMore.style.display = "none";
};

const cancelEdit = () => {
  tasks.forEach((task) => (task.editMode = false));
  renderTasks(tasks);
};

document.addEventListener("DOMContentLoaded", function () {
  setTimeout(function () {
    $splash.style.display = "none";
    isVisible = false;
    $mainContainer.hidden = false;
    if (tasks.length === 0) {
      renderNoTasks();
    }
  }, 1000);
});

$noTask.addEventListener("click", createButtonHandler);
$createButton.addEventListener("click", createButtonHandler);
$searchButton.addEventListener("click", searchButtonHandler);
