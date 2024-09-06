declare module 'add-to-calendar-button';

interface Window {
  Sequel: typeof Sequel;
  MktoForms2?: {
    loadForm: (
      marketoUrl: string,
      marketoId: string,
      marketoFormId: string
    ) => void;
    whenReady: (
      callback: (e: {
        onSuccess: (
          e: (registrant: {FirstName: string, LastName: string, Email: string }, followUpUrl: string) => void
        ) => void;
      }) => void
    ) => void;
  };
}
