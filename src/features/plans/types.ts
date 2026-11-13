export interface SubscriptionPlan {
  plan_id: string;
  display_name: string;
  features: Record<string, unknown>;
  limits: Record<string, number>;
  status: string;
  expires_at?: string | null;
}

/** Plan limit value meaning "no limit". */
export const UNLIMITED = -1;
