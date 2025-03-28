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
  }