import { useEffect, useState } from "react";

interface SessionRedirectModalProps {
  targetUrl: string;
  sessionName: string;
}

export function SessionRedirectModal({
  targetUrl,
  sessionName,
}: SessionRedirectModalProps) {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Redirect when countdown reaches 0
      const fullUrl = new URL(targetUrl);
      fullUrl.search = window.location.search;
      window.location.href = fullUrl.toString();
    }
  }, [countdown, targetUrl]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-[500px] w-full mx-4 p-8 text-center">
        <h2 className="font-[600] text-[24px] leading-[160%] mb-4">
          Keynote Complete
        </h2>
        <p className="text-[#565E73] text-[16px] leading-[160%] mb-6">
          You are being redirected to the {sessionName}
        </p>
        <div className="text-[64px] font-bold text-[#FF1B15] animate-pulse">
          {countdown}
        </div>
      </div>
    </div>
  );
}

