/**
 * PostHog Custom Event Tracking Utilities
 * 
 * This file contains typed functions for tracking custom events in TenderHub.
 * These complement PostHog's autocapture with business-specific tracking.
 */

import posthog from 'posthog-js';

// ============================================
// User Authentication Events
// ============================================

export const trackUserSignedUp = (properties?: {
  method?: 'google' | 'email';
  source?: string;
}) => {
  posthog.capture('user_signed_up', {
    auth_method: properties?.method || 'unknown',
    signup_source: properties?.source || 'unknown',
    timestamp: new Date().toISOString(),
  });
};

export const trackUserSignedIn = (properties?: {
  method?: 'google' | 'email';
  userId?: string;
}) => {
  posthog.capture('user_signed_in', {
    auth_method: properties?.method || 'unknown',
    user_id: properties?.userId,
    timestamp: new Date().toISOString(),
  });
};

export const trackUserSignedOut = () => {
  posthog.capture('user_signed_out', {
    timestamp: new Date().toISOString(),
  });
  posthog.reset(); // Clear user identification
};

// ============================================
// Tender Search & Discovery Events
// ============================================

export const trackTenderSearch = (properties: {
  query?: string;
  resultsCount: number;
  page?: number;
}) => {
  posthog.capture('tender_searched', {
    search_query: properties.query || 'all_tenders',
    results_count: properties.resultsCount,
    page_number: properties.page || 1,
    has_query: Boolean(properties.query),
    timestamp: new Date().toISOString(),
  });
};

export const trackTenderViewed = (properties: {
  tenderId: string;
  tenderTitle: string;
  organization: string;
  source?: string;
}) => {
  posthog.capture('tender_viewed', {
    tender_id: properties.tenderId,
    tender_title: properties.tenderTitle,
    organization: properties.organization,
    view_source: properties.source || 'search_results',
    timestamp: new Date().toISOString(),
  });
};

export const trackTenderSaved = (properties: {
  tenderId: string;
  tenderTitle: string;
}) => {
  posthog.capture('tender_saved', {
    tender_id: properties.tenderId,
    tender_title: properties.tenderTitle,
    timestamp: new Date().toISOString(),
  });
};

export const trackTenderExternalClick = (properties: {
  tenderId: string;
  tenderTitle: string;
  url: string;
}) => {
  posthog.capture('tender_external_link_clicked', {
    tender_id: properties.tenderId,
    tender_title: properties.tenderTitle,
    external_url: properties.url,
    timestamp: new Date().toISOString(),
  });
};

// ============================================
// Payment & Subscription Events
// ============================================

export const trackPaymentInitiated = (properties: {
  amount: number;
  currency: string;
  plan?: string;
}) => {
  posthog.capture('payment_initiated', {
    amount: properties.amount,
    currency: properties.currency,
    plan: properties.plan || 'one_time',
    timestamp: new Date().toISOString(),
  });
};

export const trackPaymentCompleted = (properties: {
  orderId: string;
  amount: number;
  currency: string;
  plan?: string;
}) => {
  posthog.capture('payment_completed', {
    order_id: properties.orderId,
    amount: properties.amount,
    currency: properties.currency,
    plan: properties.plan || 'one_time',
    timestamp: new Date().toISOString(),
  });
};

export const trackPaymentFailed = (properties: {
  orderId?: string;
  amount: number;
  reason?: string;
}) => {
  posthog.capture('payment_failed', {
    order_id: properties.orderId,
    amount: properties.amount,
    failure_reason: properties.reason || 'unknown',
    timestamp: new Date().toISOString(),
  });
};

// ============================================
// Waitlist & Email Signup Events
// ============================================

export const trackWaitlistJoined = (properties: {
  email: string;
  source: string;
}) => {
  posthog.capture('waitlist_joined', {
    email: properties.email,
    signup_source: properties.source,
    timestamp: new Date().toISOString(),
  });
};

export const trackEmailSignup = (properties: {
  email: string;
  source: string;
  success: boolean;
}) => {
  posthog.capture('email_signup', {
    email: properties.email,
    signup_source: properties.source,
    success: properties.success,
    timestamp: new Date().toISOString(),
  });
};

// ============================================
// Feature Usage Events
// ============================================

export const trackFeatureUsed = (properties: {
  featureName: string;
  location?: string;
  metadata?: Record<string, any>;
}) => {
  posthog.capture('feature_used', {
    feature_name: properties.featureName,
    location: properties.location || 'unknown',
    ...properties.metadata,
    timestamp: new Date().toISOString(),
  });
};

export const trackDashboardViewed = (properties?: {
  section?: string;
}) => {
  posthog.capture('dashboard_viewed', {
    section: properties?.section || 'home',
    timestamp: new Date().toISOString(),
  });
};

// ============================================
// Error Tracking (Complement to autocapture)
// ============================================

export const trackError = (properties: {
  errorName: string;
  errorMessage: string;
  errorStack?: string;
  context?: string;
}) => {
  posthog.capture('custom_error', {
    error_name: properties.errorName,
    error_message: properties.errorMessage,
    error_stack: properties.errorStack,
    error_context: properties.context || 'unknown',
    timestamp: new Date().toISOString(),
  });
};

// ============================================
// User Identification
// ============================================

/**
 * Identify a user in PostHog
 * Call this after successful sign-in/sign-up
 */
export const identifyUser = (properties: {
  userId: string;
  email?: string;
  name?: string;
  signupDate?: string;
  plan?: string;
}) => {
  posthog.identify(properties.userId, {
    email: properties.email,
    name: properties.name,
    signup_date: properties.signupDate,
    plan: properties.plan || 'free',
  });
};

/**
 * Set user properties without identifying
 * Use this to add additional properties to an identified user
 */
export const setUserProperties = (properties: Record<string, any>) => {
  posthog.setPersonProperties(properties);
};

/**
 * Reset PostHog (call on sign out)
 */
export const resetPostHog = () => {
  posthog.reset();
};

