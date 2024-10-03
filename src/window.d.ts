declare module 'add-to-calendar-button';

interface HubSpotForms {
  create: (options: {
    portalId: string;
    formId: string;
    target: string;
    onFormSubmitted?: (formData: any) => void;
  }) => void;
}

interface Window {
  Sequel: typeof Sequel;
  hbspt?: {
    forms: HubSpotForms;
  };
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
