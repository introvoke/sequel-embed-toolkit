export interface Registration {
  enabled?: boolean;
  customUrl?: string;
  marketoFormId?: string;
  marketoFormUrl?: string;
  marketoMunchkinId?: string;
  marketoBaseUrl?: string;
  hubspotPortalId?: string;
  hubspotFormId?: string;
  outsideOfAppEnabled?: boolean;
}

export interface Event {
  uid: string;
  name: string;
  description?: string;
  picture?: string;
  startDate: Date;
  endDate: Date;
  timezone: string;
  registration?: Registration;
  organizerUid: string;
  agenda?: EventAgenda;
}

export type EventAgendaScheduleItem = {
  title: string;
  startDate: Date;
  endDate: Date;
  eventId: string;
  url: string;
  supheading: string;
  heading: string;
  content: string;
  coverImage?: string;
  list?: string[];
};

export type EventAgenda = {
  heading: string;
  subheading: string;
  schedule: EventAgendaScheduleItem[];
};
