/**
 * PostHog Custom Event Tracking Utilities - Enhanced Edition
 * 
 * This file contains typed functions for tracking custom events in TenderHub.
 * These complement PostHog's autocapture with business-specific tracking.
 * 
 * Best Practices Applied:
 * - Consistent snake_case naming convention
 * - Rich event properties for deep analytics
 * - User journey tracking across all touchpoints
 * - Session and engagement metrics
 * - Funnel optimization data
 */

import posthog from 'posthog-js';

// ============================================
// User Authentication Events
// ============================================

export const trackUserSignedUp = (properties?: {
  method?: 'google' | 'email';
  source?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}) => {
  posthog.capture('user_signed_up', {
    auth_method: properties?.method || 'unknown',
    signup_source: properties?.source || 'unknown',
    referrer: properties?.referrer || document.referrer || 'direct',
    utm_source: properties?.utm_source,
    utm_medium: properties?.utm_medium,
    utm_campaign: properties?.utm_campaign,
    timestamp: new Date().toISOString(),
    user_agent: navigator.userAgent,
    screen_width: window.innerWidth,
    screen_height: window.innerHeight,
  });
};

export const trackUserSignedIn = (properties?: {
  method?: 'google' | 'email';
  userId?: string;
  isReturningUser?: boolean;
  lastLoginDays?: number;
}) => {
  posthog.capture('user_signed_in', {
    auth_method: properties?.method || 'unknown',
    user_id: properties?.userId,
    is_returning_user: properties?.isReturningUser || false,
    last_login_days_ago: properties?.lastLoginDays,
    timestamp: new Date().toISOString(),
    user_agent: navigator.userAgent,
  });
};

export const trackUserSignedOut = (properties?: {
  sessionDuration?: number;
  pagesViewed?: number;
  actionsPerformed?: number;
}) => {
  posthog.capture('user_signed_out', {
    session_duration_seconds: properties?.sessionDuration,
    pages_viewed: properties?.pagesViewed,
    actions_performed: properties?.actionsPerformed,
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
  filters?: Record<string, any>;
  searchDuration?: number;
  fromCache?: boolean;
}) => {
  posthog.capture('tender_searched', {
    search_query: properties.query || 'all_tenders',
    results_count: properties.resultsCount,
    page_number: properties.page || 1,
    has_query: Boolean(properties.query),
    search_filters_applied: properties.filters ? Object.keys(properties.filters).length : 0,
    search_duration_ms: properties.searchDuration,
    from_cache: properties.fromCache || false,
    query_length: properties.query?.length || 0,
    timestamp: new Date().toISOString(),
  });
};

export const trackTenderViewed = (properties: {
  tenderId: string;
  tenderTitle: string;
  organization: string;
  source?: string;
  closingDate?: string;
  amount?: number;
  position?: number;
}) => {
  posthog.capture('tender_viewed', {
    tender_id: properties.tenderId,
    tender_title: properties.tenderTitle,
    organization: properties.organization,
    view_source: properties.source || 'search_results',
    closing_date: properties.closingDate,
    tender_amount: properties.amount,
    position_in_list: properties.position,
    timestamp: new Date().toISOString(),
  });
};

export const trackTenderSaved = (properties: {
  tenderId: string;
  tenderTitle: string;
  source?: string;
  organization?: string;
}) => {
  posthog.capture('tender_saved', {
    tender_id: properties.tenderId,
    tender_title: properties.tenderTitle,
    save_source: properties.source || 'search_results',
    organization: properties.organization,
    timestamp: new Date().toISOString(),
  });
};

export const trackTenderExternalClick = (properties: {
  tenderId: string;
  tenderTitle: string;
  url: string;
  position?: number;
  timeSpentViewing?: number;
}) => {
  posthog.capture('tender_external_link_clicked', {
    tender_id: properties.tenderId,
    tender_title: properties.tenderTitle,
    external_url: properties.url,
    position_in_list: properties.position,
    time_spent_viewing_seconds: properties.timeSpentViewing,
    timestamp: new Date().toISOString(),
  });
};

export const trackSearchFilterApplied = (properties: {
  filterType: string;
  filterValue: any;
  resultsCount: number;
}) => {
  posthog.capture('search_filter_applied', {
    filter_type: properties.filterType,
    filter_value: properties.filterValue,
    results_after_filter: properties.resultsCount,
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
  paymentMethod?: string;
  isFirstPurchase?: boolean;
  timeToInitiate?: number;
}) => {
  posthog.capture('payment_initiated', {
    amount: properties.amount,
    currency: properties.currency,
    plan: properties.plan || 'one_time',
    payment_method: properties.paymentMethod,
    is_first_purchase: properties.isFirstPurchase,
    time_to_initiate_seconds: properties.timeToInitiate,
    timestamp: new Date().toISOString(),
  });
};

export const trackPaymentCompleted = (properties: {
  orderId: string;
  amount: number;
  currency: string;
  plan?: string;
  paymentMethod?: string;
  transactionDuration?: number;
}) => {
  posthog.capture('payment_completed', {
    order_id: properties.orderId,
    amount: properties.amount,
    currency: properties.currency,
    plan: properties.plan || 'one_time',
    payment_method: properties.paymentMethod,
    transaction_duration_seconds: properties.transactionDuration,
    timestamp: new Date().toISOString(),
  });
};

export const trackPaymentFailed = (properties: {
  orderId?: string;
  amount: number;
  reason?: string;
  errorCode?: string;
  attemptNumber?: number;
}) => {
  posthog.capture('payment_failed', {
    order_id: properties.orderId,
    amount: properties.amount,
    failure_reason: properties.reason || 'unknown',
    error_code: properties.errorCode,
    attempt_number: properties.attemptNumber,
    timestamp: new Date().toISOString(),
  });
};

export const trackPaymentPageViewed = (properties: {
  plan: string;
  amount: number;
  source?: string;
}) => {
  posthog.capture('payment_page_viewed', {
    plan: properties.plan,
    amount: properties.amount,
    source: properties.source || 'pricing_page',
    timestamp: new Date().toISOString(),
  });
};

export const trackPaymentFormFieldFilled = (properties: {
  fieldName: string;
  isValid: boolean;
}) => {
  posthog.capture('payment_form_field_filled', {
    field_name: properties.fieldName,
    is_valid: properties.isValid,
    timestamp: new Date().toISOString(),
  });
};

// ============================================
// Waitlist & Email Signup Events
// ============================================

export const trackWaitlistJoined = (properties: {
  email: string;
  source: string;
  timeOnPageBeforeSignup?: number;
  scrollDepth?: number;
  utmSource?: string;
  utmMedium?: string;
}) => {
  posthog.capture('waitlist_joined', {
    email: properties.email,
    signup_source: properties.source,
    time_on_page_seconds: properties.timeOnPageBeforeSignup,
    scroll_depth_percentage: properties.scrollDepth,
    utm_source: properties.utmSource,
    utm_medium: properties.utmMedium,
    timestamp: new Date().toISOString(),
  });
};

export const trackEmailSignup = (properties: {
  email: string;
  source: string;
  success: boolean;
  errorMessage?: string;
  attemptNumber?: number;
}) => {
  posthog.capture('email_signup', {
    email: properties.email,
    signup_source: properties.source,
    success: properties.success,
    error_message: properties.errorMessage,
    attempt_number: properties.attemptNumber || 1,
    timestamp: new Date().toISOString(),
  });
};

export const trackWaitlistOverlayShown = (properties?: {
  triggerType?: 'auto' | 'manual' | 'scroll' | 'time';
  secondsOnPage?: number;
}) => {
  posthog.capture('waitlist_overlay_shown', {
    trigger_type: properties?.triggerType || 'auto',
    seconds_on_page: properties?.secondsOnPage,
    timestamp: new Date().toISOString(),
  });
};

export const trackWaitlistOverlayDismissed = (properties?: {
  dismissMethod?: 'close_button' | 'outside_click' | 'escape_key';
  timeBeforeDismiss?: number;
}) => {
  posthog.capture('waitlist_overlay_dismissed', {
    dismiss_method: properties?.dismissMethod || 'unknown',
    time_before_dismiss_seconds: properties?.timeBeforeDismiss,
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
  timeSpent?: number;
  successful?: boolean;
}) => {
  posthog.capture('feature_used', {
    feature_name: properties.featureName,
    location: properties.location || 'unknown',
    time_spent_seconds: properties.timeSpent,
    successful: properties.successful,
    ...properties.metadata,
    timestamp: new Date().toISOString(),
  });
};

export const trackDashboardViewed = (properties?: {
  section?: string;
  isFirstVisit?: boolean;
  previousSection?: string;
}) => {
  posthog.capture('dashboard_viewed', {
    section: properties?.section || 'home',
    is_first_visit: properties?.isFirstVisit,
    previous_section: properties?.previousSection,
    timestamp: new Date().toISOString(),
  });
};

export const trackDashboardTabChanged = (properties: {
  fromTab: string;
  toTab: string;
  timeOnPreviousTab?: number;
}) => {
  posthog.capture('dashboard_tab_changed', {
    from_tab: properties.fromTab,
    to_tab: properties.toTab,
    time_on_previous_tab_seconds: properties.timeOnPreviousTab,
    timestamp: new Date().toISOString(),
  });
};

export const trackDashboardSearchUsed = (properties: {
  query: string;
  resultsCount?: number;
  location: string;
}) => {
  posthog.capture('dashboard_search_used', {
    search_query: properties.query,
    results_count: properties.resultsCount,
    location: properties.location,
    query_length: properties.query.length,
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

// ============================================
// Homepage & Landing Page Events
// ============================================

export const trackCtaClicked = (properties: {
  ctaText: string;
  ctaLocation: string;
  ctaType: 'button' | 'link' | 'banner';
  targetUrl?: string;
}) => {
  posthog.capture('cta_clicked', {
    cta_text: properties.ctaText,
    cta_location: properties.ctaLocation,
    cta_type: properties.ctaType,
    target_url: properties.targetUrl,
    timestamp: new Date().toISOString(),
  });
};

export const trackPricingPlanViewed = (properties: {
  planName: string;
  planAmount: number;
  viewDuration?: number;
}) => {
  posthog.capture('pricing_plan_viewed', {
    plan_name: properties.planName,
    plan_amount: properties.planAmount,
    view_duration_seconds: properties.viewDuration,
    timestamp: new Date().toISOString(),
  });
};

export const trackPricingPlanSelected = (properties: {
  planName: string;
  planAmount: number;
  previousPlan?: string;
  timeToDecide?: number;
}) => {
  posthog.capture('pricing_plan_selected', {
    plan_name: properties.planName,
    plan_amount: properties.planAmount,
    previous_plan: properties.previousPlan,
    time_to_decide_seconds: properties.timeToDecide,
    timestamp: new Date().toISOString(),
  });
};

export const trackFaqExpanded = (properties: {
  question: string;
  questionIndex: number;
  timeToExpand?: number;
}) => {
  posthog.capture('faq_expanded', {
    faq_question: properties.question,
    faq_index: properties.questionIndex,
    time_to_expand_seconds: properties.timeToExpand,
    timestamp: new Date().toISOString(),
  });
};

export const trackFaqCollapsed = (properties: {
  question: string;
  questionIndex: number;
  timeSpentReading?: number;
}) => {
  posthog.capture('faq_collapsed', {
    faq_question: properties.question,
    faq_index: properties.questionIndex,
    time_spent_reading_seconds: properties.timeSpentReading,
    timestamp: new Date().toISOString(),
  });
};

export const trackFeatureCardViewed = (properties: {
  featureTitle: string;
  featureIndex: number;
  scrollDepth: number;
}) => {
  posthog.capture('feature_card_viewed', {
    feature_title: properties.featureTitle,
    feature_index: properties.featureIndex,
    scroll_depth_percentage: properties.scrollDepth,
    timestamp: new Date().toISOString(),
  });
};

export const trackNavigationClicked = (properties: {
  linkText: string;
  linkDestination: string;
  navigationLocation: 'header' | 'footer' | 'sidebar';
}) => {
  posthog.capture('navigation_clicked', {
    link_text: properties.linkText,
    link_destination: properties.linkDestination,
    navigation_location: properties.navigationLocation,
    timestamp: new Date().toISOString(),
  });
};

export const trackScrollDepth = (properties: {
  depthPercentage: number;
  pagePath: string;
  timeToReachDepth: number;
}) => {
  posthog.capture('scroll_depth_reached', {
    depth_percentage: properties.depthPercentage,
    page_path: properties.pagePath,
    time_to_reach_seconds: properties.timeToReachDepth,
    timestamp: new Date().toISOString(),
  });
};

export const trackVideoPlayed = (properties: {
  videoTitle: string;
  videoLocation: string;
  autoplay: boolean;
}) => {
  posthog.capture('video_played', {
    video_title: properties.videoTitle,
    video_location: properties.videoLocation,
    autoplay: properties.autoplay,
    timestamp: new Date().toISOString(),
  });
};

export const trackVideoCompleted = (properties: {
  videoTitle: string;
  videoDuration: number;
  completionRate: number;
}) => {
  posthog.capture('video_completed', {
    video_title: properties.videoTitle,
    video_duration_seconds: properties.videoDuration,
    completion_rate_percentage: properties.completionRate,
    timestamp: new Date().toISOString(),
  });
};

// ============================================
// User Engagement & Session Metrics
// ============================================

export const trackPageEngagement = (properties: {
  pagePath: string;
  timeOnPage: number;
  scrollDepth: number;
  clicksCount: number;
  readingTime?: number;
}) => {
  posthog.capture('page_engagement', {
    page_path: properties.pagePath,
    time_on_page_seconds: properties.timeOnPage,
    scroll_depth_percentage: properties.scrollDepth,
    clicks_count: properties.clicksCount,
    estimated_reading_time_seconds: properties.readingTime,
    timestamp: new Date().toISOString(),
  });
};

export const trackSessionQuality = (properties: {
  sessionDuration: number;
  pagesVisited: number;
  eventsCount: number;
  bounced: boolean;
  converted: boolean;
}) => {
  posthog.capture('session_quality', {
    session_duration_seconds: properties.sessionDuration,
    pages_visited: properties.pagesVisited,
    events_count: properties.eventsCount,
    bounced: properties.bounced,
    converted: properties.converted,
    timestamp: new Date().toISOString(),
  });
};

export const trackUserInactive = (properties: {
  inactiveDuration: number;
  currentPage: string;
  lastAction: string;
}) => {
  posthog.capture('user_inactive', {
    inactive_duration_seconds: properties.inactiveDuration,
    current_page: properties.currentPage,
    last_action: properties.lastAction,
    timestamp: new Date().toISOString(),
  });
};

export const trackUserReturned = (properties: {
  returnAfterSeconds: number;
  currentPage: string;
}) => {
  posthog.capture('user_returned', {
    return_after_seconds: properties.returnAfterSeconds,
    current_page: properties.currentPage,
    timestamp: new Date().toISOString(),
  });
};

// ============================================
// Form Interaction Events
// ============================================

export const trackFormStarted = (properties: {
  formName: string;
  formLocation: string;
  fieldsCount: number;
}) => {
  posthog.capture('form_started', {
    form_name: properties.formName,
    form_location: properties.formLocation,
    fields_count: properties.fieldsCount,
    timestamp: new Date().toISOString(),
  });
};

export const trackFormFieldFocused = (properties: {
  formName: string;
  fieldName: string;
  fieldIndex: number;
}) => {
  posthog.capture('form_field_focused', {
    form_name: properties.formName,
    field_name: properties.fieldName,
    field_index: properties.fieldIndex,
    timestamp: new Date().toISOString(),
  });
};

export const trackFormFieldCompleted = (properties: {
  formName: string;
  fieldName: string;
  fieldIndex: number;
  timeToComplete: number;
  isValid: boolean;
}) => {
  posthog.capture('form_field_completed', {
    form_name: properties.formName,
    field_name: properties.fieldName,
    field_index: properties.fieldIndex,
    time_to_complete_seconds: properties.timeToComplete,
    is_valid: properties.isValid,
    timestamp: new Date().toISOString(),
  });
};

export const trackFormFieldError = (properties: {
  formName: string;
  fieldName: string;
  errorType: string;
  errorMessage: string;
  attemptNumber: number;
}) => {
  posthog.capture('form_field_error', {
    form_name: properties.formName,
    field_name: properties.fieldName,
    error_type: properties.errorType,
    error_message: properties.errorMessage,
    attempt_number: properties.attemptNumber,
    timestamp: new Date().toISOString(),
  });
};

export const trackFormSubmitted = (properties: {
  formName: string;
  formLocation: string;
  timeToComplete: number;
  fieldsCompleted: number;
  totalFields: number;
  success: boolean;
}) => {
  posthog.capture('form_submitted', {
    form_name: properties.formName,
    form_location: properties.formLocation,
    time_to_complete_seconds: properties.timeToComplete,
    fields_completed: properties.fieldsCompleted,
    total_fields: properties.totalFields,
    completion_rate: (properties.fieldsCompleted / properties.totalFields) * 100,
    success: properties.success,
    timestamp: new Date().toISOString(),
  });
};

export const trackFormAbandoned = (properties: {
  formName: string;
  formLocation: string;
  fieldsCompleted: number;
  totalFields: number;
  lastFieldCompleted: string;
  timeSpent: number;
}) => {
  posthog.capture('form_abandoned', {
    form_name: properties.formName,
    form_location: properties.formLocation,
    fields_completed: properties.fieldsCompleted,
    total_fields: properties.totalFields,
    last_field_completed: properties.lastFieldCompleted,
    time_spent_seconds: properties.timeSpent,
    abandonment_rate: ((properties.totalFields - properties.fieldsCompleted) / properties.totalFields) * 100,
    timestamp: new Date().toISOString(),
  });
};

// ============================================
// Onboarding & User Journey Events
// ============================================

export const trackOnboardingStepViewed = (properties: {
  stepNumber: number;
  stepName: string;
  isFirstTime: boolean;
}) => {
  posthog.capture('onboarding_step_viewed', {
    step_number: properties.stepNumber,
    step_name: properties.stepName,
    is_first_time: properties.isFirstTime,
    timestamp: new Date().toISOString(),
  });
};

export const trackOnboardingStepCompleted = (properties: {
  stepNumber: number;
  stepName: string;
  timeToComplete: number;
  skipped: boolean;
}) => {
  posthog.capture('onboarding_step_completed', {
    step_number: properties.stepNumber,
    step_name: properties.stepName,
    time_to_complete_seconds: properties.timeToComplete,
    skipped: properties.skipped,
    timestamp: new Date().toISOString(),
  });
};

export const trackOnboardingCompleted = (properties: {
  totalSteps: number;
  stepsCompleted: number;
  totalTime: number;
  completionRate: number;
}) => {
  posthog.capture('onboarding_completed', {
    total_steps: properties.totalSteps,
    steps_completed: properties.stepsCompleted,
    total_time_seconds: properties.totalTime,
    completion_rate_percentage: properties.completionRate,
    timestamp: new Date().toISOString(),
  });
};

export const trackOnboardingAbandoned = (properties: {
  lastStepCompleted: number;
  lastStepName: string;
  totalSteps: number;
  timeSpent: number;
}) => {
  posthog.capture('onboarding_abandoned', {
    last_step_completed: properties.lastStepCompleted,
    last_step_name: properties.lastStepName,
    total_steps: properties.totalSteps,
    time_spent_seconds: properties.timeSpent,
    abandonment_point_percentage: (properties.lastStepCompleted / properties.totalSteps) * 100,
    timestamp: new Date().toISOString(),
  });
};

// ============================================
// Search & Discovery Events (Homepage)
// ============================================

export const trackHomepageSearchUsed = (properties: {
  query: string;
  source: 'hero' | 'cta' | 'banner';
  convertedToSignup: boolean;
}) => {
  posthog.capture('homepage_search_used', {
    search_query: properties.query,
    search_source: properties.source,
    converted_to_signup: properties.convertedToSignup,
    query_length: properties.query.length,
    timestamp: new Date().toISOString(),
  });
};

export const trackTrustBadgeClicked = (properties: {
  badgeName: string;
  badgePosition: number;
}) => {
  posthog.capture('trust_badge_clicked', {
    badge_name: properties.badgeName,
    badge_position: properties.badgePosition,
    timestamp: new Date().toISOString(),
  });
};

export const trackSocialProofViewed = (properties: {
  proofType: 'testimonial' | 'stat' | 'logo' | 'badge';
  content: string;
  position: number;
}) => {
  posthog.capture('social_proof_viewed', {
    proof_type: properties.proofType,
    content: properties.content,
    position: properties.position,
    timestamp: new Date().toISOString(),
  });
};

