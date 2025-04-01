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
  startDate: Date;
  endDate: Date;
  timezone: string;
  registration?: Registration;
  organizerUid: string;
  agenda?: Agenda;
}

export type AgendaBlock = {
  supheading: string;
  heading: string;
  content: string;
  coverImage?: string;
};

export type AgendaScheduleItem = {
  title: string;
  startDate: Date;
  endDate: Date;
  blocks: AgendaBlock[];
};

export type Agenda = {
  heading: string;
  subheading: string;
  schedule: AgendaScheduleItem[];
};
