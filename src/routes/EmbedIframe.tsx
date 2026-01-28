import { useMemo } from "react";
import { ApiConfig } from "@src/api/apiConfig";

interface EmbedIframeProps {
  eventId: string;
  joinCode?: string;
  isPopup?: boolean;
  viewReplay?: string;
  registrationOnly?: boolean;
}

export const EmbedIframe = ({ eventId, joinCode, isPopup, viewReplay, registrationOnly }: EmbedIframeProps) => {
  const iframeUrl = useMemo(() => {
    const url = new URL(`${ApiConfig.GetEmbedUrl()}/event/${eventId}`);
    const params = url.searchParams;

    // First, read ALL search parameters from the current page URL
    // This includes joinCode, hybrid, viewReplay, registrationOnly, and any other custom params
    const currentPageParams = new URLSearchParams(window.location.search);
    currentPageParams.forEach((value, key) => {
      params.set(key, value);
    });

    // Then, set explicitly provided parameters (these override URL params)
    if (joinCode !== undefined) {
      params.set('joinCode', joinCode);
    }
    if (viewReplay !== undefined) {
      params.set('viewReplay', viewReplay);
    }
    if (registrationOnly !== undefined) {
      params.set('registrationOnly', String(registrationOnly));
    }

    return url.toString();
  }, [eventId, joinCode, viewReplay, registrationOnly]);

  // Read hybrid from URL params for styling purposes
  const urlParams = new URLSearchParams(window.location.search);
  const hybrid = urlParams.get('hybrid') === 'true';

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
