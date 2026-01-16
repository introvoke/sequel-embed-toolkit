// AI Personalization Engine - determines what content to show based on ICP and actions

import { UserICP, UserAction, ContentRecommendation } from '@src/types/personalization';

// Mock content database - Funnel-based marketing content
const contentDatabase: ContentRecommendation[] = [
  // ========== TOP FUNNEL (Awareness & Engagement) ==========
  {
    type: 'poll',
    title: 'Quick Poll: What\'s Your Biggest Marketing Challenge?',
    description: 'Help us understand your priorities - takes 30 seconds',
    url: 'https://example.com/poll/challenges',
    thumbnail: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400',
    relevanceScore: 0,
    funnelStage: 'top',
  },
  {
    type: 'blog',
    title: '7 Event Marketing Trends Shaping 2024',
    description: 'Latest insights from analyzing 10,000+ B2B webinars',
    url: 'https://example.com/blog/trends-2024',
    thumbnail: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400',
    relevanceScore: 0,
    funnelStage: 'top',
  },
  {
    type: 'video',
    title: 'Product Update: New AI-Powered Features',
    description: '5-minute overview of our latest platform enhancements',
    url: 'https://example.com/videos/product-update',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
    relevanceScore: 0,
    funnelStage: 'top',
  },
  {
    type: 'doc',
    title: 'The Complete Guide to Event Marketing ROI',
    description: 'Free 30-page guide with frameworks, templates, and benchmarks',
    url: 'https://example.com/guides/roi-guide',
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400',
    relevanceScore: 0,
    funnelStage: 'top',
  },
  {
    type: 'blog',
    title: 'Case Study: How TechCorp Generated $2M in Pipeline',
    description: 'Real strategies from a VP of Marketing at a Series B SaaS company',
    url: 'https://example.com/blog/techcorp-case-study',
    thumbnail: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400',
    relevanceScore: 0,
    funnelStage: 'top',
  },
  {
    type: 'video',
    title: 'Quick Tips: 3 Ways to Boost Webinar Attendance',
    description: 'Proven tactics to increase registration-to-attendance rates',
    url: 'https://example.com/videos/attendance-tips',
    thumbnail: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=400',
    relevanceScore: 0,
    funnelStage: 'top',
  },

  // ========== MID FUNNEL (Consideration & Engagement) ==========
  {
    type: 'webinar',
    title: 'Live Webinar: Advanced Event Marketing Strategies',
    description: 'Join our next session on March 15 - limited spots available',
    url: 'https://example.com/webinar/advanced-strategies',
    thumbnail: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=400',
    relevanceScore: 0,
    funnelStage: 'mid',
  },
  {
    type: 'nps',
    title: 'How Likely Are You to Recommend This Event?',
    description: 'Share your feedback and help us improve future sessions',
    url: 'https://example.com/nps/event-feedback',
    thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400',
    relevanceScore: 0,
    funnelStage: 'mid',
  },
  {
    type: 'survey',
    title: 'Marketing Tech Stack Survey 2024',
    description: 'Tell us what tools you use - get the full report with 500+ responses',
    url: 'https://example.com/survey/tech-stack',
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400',
    relevanceScore: 0,
    funnelStage: 'mid',
  },
  {
    type: 'newsletter',
    title: 'Subscribe to Marketing Insights Weekly',
    description: 'Get exclusive tips, case studies, and trends delivered every Tuesday',
    url: 'https://example.com/newsletter/subscribe',
    thumbnail: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400',
    relevanceScore: 0,
    funnelStage: 'mid',
  },
  {
    type: 'webinar',
    title: 'On-Demand: Marketing Automation Masterclass',
    description: 'Watch the full recording from our sold-out session (45 mins)',
    url: 'https://example.com/webinar/automation-replay',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
    relevanceScore: 0,
    funnelStage: 'mid',
  },
  {
    type: 'doc',
    title: 'Recommended: Event Promotion Playbook',
    description: 'Based on your interests - templates for every campaign stage',
    url: 'https://example.com/docs/promotion-playbook',
    thumbnail: 'https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?w=400',
    relevanceScore: 0,
    funnelStage: 'mid',
  },

  // ========== BOTTOM FUNNEL (High Intent & Conversion) ==========
  {
    type: 'demo',
    title: 'Book a Personalized Demo',
    description: 'See the platform in action with a solution consultant (30 mins)',
    url: 'https://example.com/demo/book',
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400',
    relevanceScore: 0,
    funnelStage: 'bottom',
  },
  {
    type: 'demo',
    title: 'Schedule a Strategy Call with Our Team',
    description: 'Discuss your goals and get a custom implementation roadmap',
    url: 'https://example.com/demo/strategy-call',
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400',
    relevanceScore: 0,
    funnelStage: 'bottom',
  },
  {
    type: 'demo',
    title: 'Get a Custom ROI Analysis',
    description: 'Work with our team to calculate your potential revenue impact',
    url: 'https://example.com/demo/roi-analysis',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
    relevanceScore: 0,
    funnelStage: 'bottom',
  },
  {
    type: 'demo',
    title: 'Start Your Free Trial Today',
    description: 'Get full access for 14 days - no credit card required',
    url: 'https://example.com/trial/start',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
    relevanceScore: 0,
    funnelStage: 'bottom',
  },
];

export class PersonalizationEngine {
  /**
   * Calculate relevance scores for content based on user ICP
   * Simplified for funnel-based approach
   */
  static scoreContentByICP(userICP: UserICP): ContentRecommendation[] {
    return contentDatabase.map(content => {
      let score = 50; // Base score - funnel progression will be the main driver
      let reason = '';

      // All marketing professionals get similar base content
      // Funnel stage (driven by engagement) is the primary differentiator
      
      // Slight role adjustments for relevance
      const titleLower = userICP.title.toLowerCase();
      const isExecutive = titleLower.includes('vp') || titleLower.includes('director') || 
                          titleLower.includes('cmo') || titleLower.includes('head of');
      
      // Executives might prefer certain content types
      if (isExecutive) {
        if (content.title.includes('ROI') || content.title.includes('Strategy')) {
          score += 10;
          reason = 'Relevant to your role';
        }
      }

      // Company size minor adjustments
      if (userICP.companySize === 'enterprise' && content.title.includes('Enterprise')) {
        score += 5;
      }

      return {
        ...content,
        relevanceScore: Math.min(100, score),
        reason,
      };
    });
  }

  /**
   * Adjust recommendations based on user actions and funnel progression
   */
  static adjustForActions(
    baseRecommendations: ContentRecommendation[],
    actions: UserAction[]
  ): ContentRecommendation[] {
    const recommendations = [...baseRecommendations];
    const engagementScore = this.calculateEngagementScore(actions);

    // Determine funnel stage based on engagement
    let primaryFunnel: 'top' | 'mid' | 'bottom';
    if (engagementScore === 0) {
      primaryFunnel = 'top'; // No engagement - show awareness content
    } else if (engagementScore < 50) {
      primaryFunnel = 'top'; // Low engagement - still in awareness
    } else if (engagementScore < 80) {
      primaryFunnel = 'mid'; // Medium engagement - consideration stage
    } else {
      primaryFunnel = 'bottom'; // High engagement - ready to convert
    }

    // Apply funnel-based scoring
    recommendations.forEach(rec => {
      // Boost content matching the user's funnel stage
      if (rec.funnelStage === primaryFunnel) {
        rec.relevanceScore += 40;
        
        if (primaryFunnel === 'top') {
          rec.reason = 'Discover more insights';
        } else if (primaryFunnel === 'mid') {
          rec.reason = 'Continue your journey';
        } else {
          rec.reason = 'Ready when you are';
        }
      }
      
      // Slightly boost adjacent funnel stages
      if (primaryFunnel === 'mid') {
        if (rec.funnelStage === 'top') {
          rec.relevanceScore += 15; // Still show some top content
        } else if (rec.funnelStage === 'bottom') {
          rec.relevanceScore += 20; // Start showing conversion options
        }
      } else if (primaryFunnel === 'bottom') {
        if (rec.funnelStage === 'mid') {
          rec.relevanceScore += 15; // Keep some mid-funnel options
        }
      }

      // Action-specific boosts
      actions.forEach(action => {
        switch (action.type) {
          case 'poll':
            // Polls indicate engagement - boost mid-funnel content
            if (rec.type === 'survey' || rec.type === 'nps' || rec.type === 'newsletter') {
              rec.relevanceScore += 10;
            }
            break;

          case 'cta':
            // CTA clicks show intent - boost bottom-funnel
            if (rec.funnelStage === 'bottom' || rec.type === 'demo') {
              rec.relevanceScore += 15;
            }
            break;

          case 'resource':
            // Downloads show research mode - boost mid and bottom funnel
            if (rec.funnelStage === 'mid' || rec.type === 'webinar') {
              rec.relevanceScore += 12;
            }
            break;
        }
      });
    });

    // Sort by relevance score
    return recommendations.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  /**
   * Calculate user engagement score based on actions
   */
  static calculateEngagementScore(actions: UserAction[]): number {
    if (actions.length === 0) return 0;

    let score = 0;
    actions.forEach(action => {
      switch (action.type) {
        case 'poll':
          score += 15;
          break;
        case 'cta':
          score += 15;
          break;
        case 'resource':
          score += 20;
          break;
        case 'content_click':
          score += 10;
          break;
        case 'watch_time':
          // +5 points per 2 minutes watched
          score += Math.floor(action.seconds / 120) * 5;
          break;
      }
    });

    return Math.min(100, score);
  }

  /**
   * Get top N recommendations for a user
   */
  static getTopRecommendations(
    userICP: UserICP | null,
    actions: UserAction[],
    count: number = 6
  ): ContentRecommendation[] {
    if (!userICP) {
      // Return generic high-value content if no ICP data
      return contentDatabase
        .map(c => ({ ...c, relevanceScore: 50 }))
        .sort((a, b) => a.title.localeCompare(b.title))
        .slice(0, count);
    }

    // Score content by ICP
    let recommendations = this.scoreContentByICP(userICP);

    // Adjust based on actions
    if (actions.length > 0) {
      recommendations = this.adjustForActions(recommendations, actions);
    }

    return recommendations.slice(0, count);
  }

  /**
   * Generate fake ICP data for demo purposes - Marketing-focused
   */
  static generateMockICP(customQuestionAnswers?: Record<string, string>): UserICP {
    // Marketing-specific titles and companies
    const marketingTitles = [
      'VP of Marketing',
      'Marketing Manager',
      'Marketing Operations Manager',
      'Director of Marketing',
      'Marketing Automation Specialist',
      'Chief Marketing Officer',
      'Senior Marketing Manager',
      'Marketing Operations Director',
      'Head of Marketing',
      'Marketing Campaign Manager',
      'Marketing Analytics Manager'
    ];
    
    const sizes: Array<'small' | 'medium' | 'large' | 'enterprise'> = ['small', 'medium', 'large', 'enterprise'];
    const industries = ['B2B SaaS', 'Marketing Technology', 'Enterprise Software', 'FinTech', 'HR Tech'];

    const randomTitle = marketingTitles[Math.floor(Math.random() * marketingTitles.length)];
    
    // Classify marketing role more specifically
    const titleLower = randomTitle.toLowerCase();
    let role: 'vp' | 'manager' | 'operations' | 'other' = 'manager';
    
    // All are marketing, but we can still use the role field for sub-categorization if needed
    if (titleLower.includes('vp') || titleLower.includes('director') || 
        titleLower.includes('cmo') || titleLower.includes('head of')) {
      role = 'vp'; // Marketing executive
    } else if (titleLower.includes('operations') || titleLower.includes('automation') ||
               titleLower.includes('analytics')) {
      role = 'operations'; // Marketing operations
    } else {
      role = 'manager'; // Marketing manager/coordinator
    }

    return {
      title: customQuestionAnswers?.title || randomTitle,
      companySize: sizes[Math.floor(Math.random() * sizes.length)],
      industry: customQuestionAnswers?.industry || industries[Math.floor(Math.random() * industries.length)],
      role,
    };
  }
}


