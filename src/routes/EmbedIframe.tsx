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
        borderRadius: "12px", 
        border: hybrid ? "none" : "1px solid #dbdfec", 
        boxShadow: hybrid ? "none" : "3px 3px 10px 0 rgb(20 20 43 / 4%)",
      };

      const iframeClassName = isPopup 
      ? "sequel-iframe-popup" 
      : `sequel-iframe${hybrid ? " sequel-iframe-hybrid" : ""}`;
    
  
  return (
    <iframe
      allowFullScreen
      style={iframeStyle}
      allow="camera *; microphone *; autoplay; display-capture *"
      className={iframeClassName}
      title="Sequel event"
      width="100%"
      src={iframeUrl}
    />
  );
};
