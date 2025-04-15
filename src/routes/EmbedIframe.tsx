import { ApiConfig } from "@src/api/apiConfig";

interface EmbedIframeProps {
  eventId: string;
  joinCode: string;
  hybrid?: boolean;
}

export const EmbedIframe = ({ eventId, joinCode, hybrid, isPopup }: EmbedIframeProps & { isPopup?: boolean }) => {
  // Get current URL search parameters
  const searchParams = new URLSearchParams(window.location.search);
  
  // Create base URL with required parameters
  const baseUrl = `${ApiConfig.GetEmbedUrl()}/event/${eventId}?joinCode=${joinCode}&hybrid=${hybrid}`;
  
  // Add all other search parameters
  const iframeUrl = Array.from(searchParams.entries()).reduce((url, [key, value]) => {
    // Skip parameters that are already included in the base URL
    if (key === 'joinCode' || key === 'hybrid') return url;
    return `${url}&${key}=${value}`;
  }, baseUrl);

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
