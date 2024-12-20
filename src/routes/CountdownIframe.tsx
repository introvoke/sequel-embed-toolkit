import { ApiConfig } from "@src/api/apiConfig";

interface CountdownIframeProps {
  eventId: string;
}

export const CountdownIframe = ({ eventId }: CountdownIframeProps) => {
    let countdownRoot = document.getElementById('sequel_countdown');
    if (!countdownRoot) {
      console.error(
        "The Sequel countdown element was not found. Please add a div with id `sequel_countdown` to your html."
      );
      return;
    }

    // Create and render the countdown iframe
    const countdownIframe = document.createElement('iframe');
    const iframeUrl = `${ApiConfig.GetEmbedUrl()}/event/${eventId}?cleanUI=true&joinCode=attendee`;
    
    countdownIframe.src = iframeUrl;
    countdownIframe.style.height = '90vh';
    countdownIframe.style.width = '100%';
    countdownIframe.style.borderRadius = '12px';
    countdownIframe.style.border = '1px solid #dbdfec';
    countdownIframe.style.boxShadow = '3px 3px 10px 0 rgb(20 20 43 / 4%)';
    countdownIframe.allow = 'camera *; microphone *; autoplay; display-capture *';
    countdownIframe.allowFullscreen = true;
    countdownIframe.className = 'sequel-iframe';
    countdownIframe.title = 'Sequel event countdown';

    // Clear any existing content and append the new iframe
    countdownRoot.innerHTML = '';
    countdownRoot.appendChild(countdownIframe);
};