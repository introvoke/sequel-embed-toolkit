import React, { useEffect, useState } from "react";

export const RegistrationPopup: React.FC = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    window.Sequel.embedSequelRegistration({
      sequelEventId: "723b6d9d-238c-48e5-84f7-17bb2d97fe02",
      isPopup: true,
    });
  }, []);

  return (
    <>
      <div
        className="popup-container"
        id="popupContainer"
        style={{
          display: open ? "block" : "none",
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: "1000",
          backgroundColor: "white",
          width: "600px",
        }}
      >
        <div className="popup">
          <span className="popup-close" id="closePopupBtn"></span>
          <div id="sequel_root"></div>
        </div>
      </div>
      <button onClick={() => setOpen(!open)}>{open ? "Close" : "Open"}</button>
    </>
  );
};
