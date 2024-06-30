import {
  $taskInput,
  $addButton,
  $taskList,
  $searchInput,
  $searchButton,
} from "./elements.js";
import {
  showToastMessage,
  handleInputChange,
  createButton,
} from "./utilities.js";

let tasks = [];

const addButtonHandler = () => {
  const taskTitle = $taskInput.value.trim();
  if (taskTitle) {
    createTask(taskTitle);
    showToastMessage("Task added successfully!");
    $addButton.disabled = true;
  }
};

const searchButtonHandler = () => {
  const searchTitle = $searchInput.value.trim();

  if (searchTitle) {
    const filteredTasks = tasks.filter((task) =>
      task.title.toLowerCase().includes(searchTitle.toLowerCase())
    );
    if (filteredTasks.length > 0) {
      renderTasks(filteredTasks);
    } else {
      showToastMessage("No tasks found matching the search.");
    }
  } else {
    renderTasks(tasks);
  }
  $searchInput.value = "";
};

const deleteHandler = (taskId) => {
  tasks = tasks.filter((task) => task.id !== taskId);
  renderTasks(tasks);
};

const editHandler = (task) => {
  cancelEdit();
  task.editMode = true;
  renderTasks();
};

const updateHandler = (task, newTitle) => {
  if (newTitle.trim().length > 0) {
    task.title = newTitle.trim();
  }
  cancelEdit();
  renderTasks(tasks);
};

const doneHandler = (taskId) => {
  const task = tasks.find((task) => task.id === taskId);
  if (task) {
    task.done = !task.done;
    renderTasks(tasks);
  }
};

const createTask = (taskTitle) => {
  tasks.unshift({
    id: new Date().getTime(),
    title: taskTitle,
    done: false,
    editMode: false,
  });
  renderTasks(tasks);
  $taskInput.value = "";
  $addButton.disabled = true;
};

const renderTasks = (tasks = []) => {
  $taskList.innerHTML = "";
  tasks.forEach((task) => {
    const $tasksList = document.createElement("li");
    const $titleElement = document.createElement("span");
    $titleElement.textContent = task.title;
    if (task.done) {
      $titleElement.style.textDecoration = "line-through";
    }

    if (task.editMode) {
      const $inputField = document.createElement("input");
      $inputField.type = "text";
      $inputField.value = task.title;

      const $updateButton = createButton("Update", () =>
        updateHandler(task, $inputField.value)
      );
      const $cancelButton = createButton("Cancel", cancelEdit);

      $inputField.addEventListener("input", () => {
        handleInputChange($inputField, $updateButton, task);
      });

      $tasksList.append($inputField, $updateButton, $cancelButton);
    } else {
      const $deleteButton = createButton("Delete", () =>
        deleteHandler(task.id)
      );
      const $editButton = createButton("Edit", () => editHandler(task));
      const $doneButton = createButton("Done", () => doneHandler(task.id));

      $tasksList.append($titleElement, $deleteButton);
      if (!task.done) {
        $tasksList.append($editButton, $doneButton);
      }
    }

    $taskList.appendChild($tasksList);
  });
};

const cancelEdit = () => {
  tasks.forEach((task) => (task.editMode = false));
  renderTasks(tasks);
};

$taskInput.addEventListener("input", () => {
  $addButton.disabled = !$taskInput.value.trim();
});

$addButton.addEventListener("click", addButtonHandler);
$searchButton.addEventListener("click", searchButtonHandler);
