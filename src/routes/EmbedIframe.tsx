import { useMemo } from "react";
import { ApiConfig } from "@src/api/apiConfig";

interface EmbedIframeProps {
  eventId: string;
  joinCode: string;
  hybrid?: boolean;
  isPopup?: boolean;
  viewReplay?: string;
  registrationOnly?: boolean;
}

export const EmbedIframe = ({ eventId, joinCode, hybrid, isPopup, viewReplay, registrationOnly }: EmbedIframeProps) => {
  const iframeUrl = useMemo(() => {
    const url = new URL(`${ApiConfig.GetEmbedUrl()}/event/${eventId}`);
    const params = url.searchParams;

    // Set core parameters
    params.set('joinCode', joinCode);
    params.set('hybrid', String(hybrid ?? false));

    // Set optional parameters if provided
    if (viewReplay) {
      params.set('viewReplay', viewReplay);
    }
    if (registrationOnly) {
      params.set('registrationOnly', 'true');
    }

    // Merge in any additional search parameters from the current page URL
    const currentPageParams = new URLSearchParams(window.location.search);
    currentPageParams.forEach((value, key) => {
      // Skip parameters we've already set
      if (!params.has(key)) {
        params.set(key, value);
      }
    });

    return url.toString();
  }, [eventId, joinCode, hybrid, viewReplay, registrationOnly]);

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
