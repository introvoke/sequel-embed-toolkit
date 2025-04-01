import type { Meta, StoryObj } from "@storybook/react";
import { useEffect } from "react";

const AgendaWidget: React.FC = () => {
  useEffect(() => {
    window.Sequel.renderEmbedAgenda({
      eventId: "723b6d9d-238c-48e5-84f7-17bb2d97fe02",
    });
  }, []);

  return <div id="sequel_root"></div>;
};

const meta = {
  title: "Widgets/Agenda",
  component: AgendaWidget,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof AgendaWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ZoominfoExample: Story = {};
