import { ApiConfig } from "@src/api/apiConfig";
import { getSourcebusterUTMParams } from "@src/utils/cookie";

interface EmbedIframeProps {
  eventId: string;
  joinCode: string;
  hybrid?: boolean;
}

export const EmbedIframe = ({ eventId, joinCode, hybrid, isPopup }: EmbedIframeProps & { isPopup?: boolean }) => {
  // Get current URL search parameters
  const searchParams = new URLSearchParams(window.location.search);
  
  // Get Sourcebuster UTM parameters from cookies
  const sourcebusterParams = getSourcebusterUTMParams();
  
  // Create base URL with required parameters
  const baseUrl = `${ApiConfig.GetEmbedUrl()}/event/${eventId}?joinCode=${joinCode}&hybrid=${hybrid}`;
  
  // Collect all parameters to add to the iframe URL
  const allParams = new Map<string, string>();
  
  // First, add Sourcebuster parameters (lower priority)
  for (const [key, value] of Object.entries(sourcebusterParams)) {
    allParams.set(key, value);
  }
  
  // Then, add/override with URL search parameters (higher priority)
  // URL params take precedence, especially for UTM values
  for (const [key, value] of searchParams.entries()) {
    // Skip parameters that are already included in the base URL
    if (key === 'joinCode' || key === 'hybrid') continue;
    allParams.set(key, value);
  }
  
  // Build the final iframe URL with all parameters
  const iframeUrl = Array.from(allParams.entries()).reduce((url, [key, value]) => {
    return `${url}&${key}=${encodeURIComponent(value)}`;
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
    : `sequel-iframe${hybrid ? "-hybrid" : ""}`;
  
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
