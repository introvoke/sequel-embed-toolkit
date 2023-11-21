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
      style={{height: "80vh", borderRadius: "12px", border: "1px solid #dbdfec", boxShadow: "3px 3px 10px 0 rgb(20 20 43 / 4%)" }}
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
