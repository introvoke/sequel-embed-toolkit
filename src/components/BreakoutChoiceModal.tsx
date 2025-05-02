import { EventAgendaScheduleItem } from "@src/api/event/event";
import { Button } from "./Button";

interface BreakoutChoiceModalProps {
  breakouts: EventAgendaScheduleItem[];
  now: Date;
  onClose: () => void;
  onSelect: (url: string) => void;
}

export function BreakoutChoiceModal({ breakouts, now, onClose, onSelect }: BreakoutChoiceModalProps) {
  const isBreakoutLive = (breakout: EventAgendaScheduleItem) => {
    const start = new Date(breakout.startDate);
    const end = new Date(breakout.endDate);
    return now >= start && now <= end;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">Choose Your Breakout Session</h2>
        <p className="text-gray-600 mb-6">
          The main sessions have concluded. Please select which breakout session you'd like to attend.
        </p>
        
        <div className="space-y-4">
          {breakouts.map((breakout) => {
            const isLive = isBreakoutLive(breakout);
            return (
              <div 
                key={breakout.eventId} 
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-bold text-lg mb-2">{breakout.heading}</h3>
                <p className="text-gray-600 mb-2">{breakout.supheading}</p>
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${isLive ? 'text-green-600' : 'text-gray-500'}`}>
                    {isLive ? 'Live Now' : 'Starting Soon'}
                  </span>
                  <Button
                    className="bg-[#FF1B15] text-white"
                    onClick={() => onSelect(breakout.url)}
                    disabled={!isLive}
                  >
                    {isLive ? 'Join Now' : 'Not Started Yet'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            className="bg-gray-200 text-gray-800 hover:bg-gray-300"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
} 