import { state } from "../state/app_state";

export async function startCamera(video) {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;
}

export function capturePhoto(video, canvas, photoPreview, btnSubmit) {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0);

  state.photo = canvas.toDataURL("image/jpeg");
  photoPreview.src = state.photo;
  photoPreview.classList.remove("hidden");
  video.classList.add("hidden");
  btnSubmit.disabled = false;
}
