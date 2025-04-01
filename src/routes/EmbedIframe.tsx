import { ApiConfig } from "@src/api/apiConfig";

interface EmbedIframeProps {
  eventId: string;
  joinCode: string;
  hybrid?: boolean;
}

export const EmbedIframe = ({ eventId, joinCode, hybrid, isPopup }: EmbedIframeProps & { isPopup?: boolean }) => {
  const iframeUrl = `${ApiConfig.GetEmbedUrl()}/event/${eventId}?joinCode=${joinCode}&hybrid=${hybrid}`;
  
  const iframeStyle = isPopup 
    ? {
        height: "80vh",
        width: "100%", 
        border: "none", 
        borderRadius: "0",
        boxShadow: "none",
        margin: "0",
        padding: "0"
      }
    : {
        height: "90vh", 
        borderRadius: "12px", 
        border: "1px solid #dbdfec", 
        boxShadow: "3px 3px 10px 0 rgb(20 20 43 / 4%)"
      };
  
  return (
    <iframe
      allowFullScreen
      style={iframeStyle}
      allow="camera *; microphone *; autoplay; display-capture *"
      className={isPopup ? "sequel-iframe-popup" : "sequel-iframe"}
      title="Sequel event"
      width="100%"
      src={iframeUrl}
    />
  );
};
