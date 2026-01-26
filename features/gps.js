import { state } from "../state/app_state";
import { showPopup } from "../app/components/ui/popup";
import { now } from "../services/user_service";

export function initGPS(btnGPS, geoBox, setStatus, startCamera) {
  btnGPS.onclick = () => {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const geo = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };

        if (state.mode === "IN") {
          state.geoIn = geo;
          state.timeIn = now();
        } else {
          state.geoOut = geo;
          state.timeOut = now();
        }

        geoBox.textContent =
          `📍 ${geo.lat.toFixed(6)}, ${geo.lng.toFixed(6)}`;
        geoBox.classList.remove("hidden");

        setStatus("✔ GPS ผ่าน", "success");

        if (state.requireCamera) startCamera();
      },
      () => showPopup("error", "GPS ใช้งานไม่ได้", "กรุณาเปิด GPS")
    );
  };
}
