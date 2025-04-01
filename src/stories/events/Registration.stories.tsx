import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { useEffect } from "react";

const RegistrationPopup: React.FC<{ isPopup: boolean }> = ({ isPopup }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    window.Sequel.embedSequelRegistration({
      sequelEventId: "723b6d9d-238c-48e5-84f7-17bb2d97fe02",
      isPopup,
    });
    console.log(window.Sequel);
  }, []);

  return (
    <>
      <div
        className="popup-container"
        id="popupContainer"
        style={
          isPopup
            ? {
                display: open ? "block" : "none",
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: "1000",
                backgroundColor: "white",
                width: "600px",
                border: "1px solid black",
              }
            : {
                display: "block",
                position: "relative",
                width: "100%",
                maxWidth: "600px",
              }
        }
      >
        <div className="popup">
          <span className="popup-close" id="closePopupBtn"></span>
          <div id="sequel_root"></div>
        </div>
      </div>
      {isPopup && (
        <button onClick={() => setOpen(!open)}>
          {open ? "Close" : "Open"}
        </button>
      )}
    </>
  );
};

const meta = {
  title: "Events/Registration",
  component: RegistrationPopup,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof RegistrationPopup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PopupRegistration: Story = {
  args: {
    isPopup: true,
  },
};

export const InlineRegistration: Story = {
  args: {
    isPopup: false,
  },
};
