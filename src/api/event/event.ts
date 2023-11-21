export interface Registration {
    enabled?: boolean;
    customUrl?: string;
  }

export interface Event {
    uid: string;
    name: string;
    startDate: Date;
    endDate: Date;
    timezone: string;
    registration?: Registration;
  }