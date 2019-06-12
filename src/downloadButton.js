import React from "react";
import DarkButton from "./darkButton";
import LightButton from "./ligthButton";
function DownloadButton({ darkMode }) {
  return darkMode ? <LightButton /> : <DarkButton />;
}

export default DownloadButton;
