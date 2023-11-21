import { ApiConfig } from "@src/api/apiConfig";

interface EmbedIframeProps {
  eventId: string;
  joinCode: string;
}

export const EmbedIframe = ({ eventId, joinCode }: EmbedIframeProps) => {
  const iframeUrl = `${ApiConfig.GetEmbedUrl()}/event/${eventId}?joinCode=${joinCode}`;
  return (
    <iframe
      allowFullScreen
      frameBorder="0"
      allow="camera *; microphone *; autoplay; display-capture *"
      className=""
      title="Sequel event"
      width="100%"
      height="80vh"
      src={iframeUrl}
    />
  );
};
