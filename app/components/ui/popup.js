const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popupTitle");
const popupMessage = document.getElementById("popupMessage");
const popupClose = document.getElementById("popupClose");

let redirectUrl = null;

export function showPopup(type, title, message, redirect = null) {
  popup.className = `popup ${type}`;
  popupTitle.innerText = title;
  popupMessage.innerText = message;
  popup.classList.remove("hidden");
  redirectUrl = redirect;
}

popupClose.onclick = () => {
  popup.classList.add("hidden");
  if (redirectUrl) location.href = redirectUrl;
};
