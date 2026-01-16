// Type definitions for AI Personalization

export interface UserICP {
  title: string;
  companySize: string;
  industry: string;
  role: 'vp' | 'manager' | 'operations' | 'other';
}

export interface PollAction {
  type: 'poll';
  pollId: string;
  answer: string;
}

export interface CTAAction {
  type: 'cta';
  ctaId: string;
  ctaText: string;
}

export interface ResourceAction {
  type: 'resource';
  resourceId: string;
  resourceType: string;
}

export interface ContentClickAction {
  type: 'content_click';
  contentId: string;
  contentType: string;
}

export interface WatchTimeAction {
  type: 'watch_time';
  seconds: number;
}

export type UserAction = PollAction | CTAAction | ResourceAction | ContentClickAction | WatchTimeAction;

export type ContentFunnel = 'top' | 'mid' | 'bottom';

export type ContentCategory = 
  | 'poll'
  | 'blog'
  | 'video'
  | 'doc'
  | 'webinar'
  | 'nps'
  | 'survey'
  | 'newsletter'
  | 'demo';

export interface ContentRecommendation {
  type: ContentCategory;
  title: string;
  description: string;
  url: string;
  thumbnail?: string;
  relevanceScore: number;
  reason?: string;
  funnelStage: ContentFunnel;
  targetRoles?: string[];
}

export interface IframeMessage {
  event: string;
  data: any;
}
