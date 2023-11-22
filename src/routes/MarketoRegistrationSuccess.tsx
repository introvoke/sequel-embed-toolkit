import { Button } from "@src/components/Button";
import { FeaturedIcon } from "@src/components/FeaturedIcon";
import CheckVerifiedIcon from "@src/components/CheckVerified01";
import CalendarPlusIcon from "@src/components/CalendarPlus02";

interface MarketoRegistrationSuccessProps {
  onOpenEvent: () => void;
}

export const MarketoRegistrationSuccess = ({
  onOpenEvent,
}: MarketoRegistrationSuccessProps) => {
  return (
    <div className="w-full relative max-w-[540px] mx-auto">
      <FeaturedIcon
        decoration="circles"
        color="success"
        variant="square"
        icon={CheckVerifiedIcon}
        className="mb-3 z-1 relative"
      />
      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold text-black">
            Registration confirmed!
          </h2>
          <p className="text-sm text-gray-400">
            Congratulations! You have successfully registered for this event.
            Please check your email for a confirmation message or simply join
            the event by clicking below.
          </p>
        </div>
        <div className="flex-col flex gap-2">
          {/** need to render event :thinking: */}
          <Button variant="primary" className="w-full" onClick={onOpenEvent}>
            Join Session
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            startIcon={CalendarPlusIcon}
          >
            Add to Calendar
          </Button>
        </div>
      </div>
    </div>
  );
};
