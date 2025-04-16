import type { Meta, StoryObj } from "@storybook/react";
import { useEffect } from "react";

const AgendaWidget: React.FC = () => {
  useEffect(() => {
    window.Sequel.renderEmbedAgenda({
      eventId: "55ff41fa-55ff-4bf5-8012-1190dac93cb9",
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
