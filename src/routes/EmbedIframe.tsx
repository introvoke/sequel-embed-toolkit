import { ApiConfig } from "@src/api/apiConfig";

interface EmbedIframeProps {
  eventId: string;
  joinCode: string;
  hybrid?: boolean;
}

export const EmbedIframe = ({ eventId, joinCode, hybrid }: EmbedIframeProps) => {
  const iframeUrl = `${ApiConfig.GetEmbedUrl()}/event/${eventId}?joinCode=${joinCode}&hybrid=${hybrid}`;
  return (
    <iframe
      allowFullScreen
      style={{height: "90vh", borderRadius: "12px", border: "1px solid #dbdfec", boxShadow: "3px 3px 10px 0 rgb(20 20 43 / 4%)" }}
      allow="camera *; microphone *; autoplay; display-capture *"
      className="sequel-iframe"
      title="Sequel event"
      width="100%"
      height="90vh"
      src={iframeUrl}
    />
  );
};
