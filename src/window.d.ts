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
          e: ({ FirstName: string, LastName: string, Email: string }) => void
        ) => void;
      }) => void
    ) => void;
  };
}
