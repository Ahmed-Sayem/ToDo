import { $toaster } from "./elements.js";

export const showToastMessage = (message) => {
  $toaster.textContent = message;
  $toaster.hidden = false;
  setTimeout(() => {
    $toaster.hidden = true;
  }, 1500);
};

export const handleInputChange = ($inputField, $updateButton, currentTask) => {
  const trimmedValue = $inputField.value.trim();
  $updateButton.disabled = !(
    trimmedValue.length > 0 && trimmedValue !== currentTask.title
  );
};

export const createButton = (text, onClick) => {
  const $button = document.createElement("button");
  $button.innerText = text;
  $button.addEventListener("click", onClick);
  return $button;
};
