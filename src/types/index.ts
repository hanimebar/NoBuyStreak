export type Category =
  | "clothing"
  | "food"
  | "tech"
  | "beauty"
  | "homewares"
  | "other";

export type TriggerSource =
  | "instagram"
  | "tiktok"
  | "email"
  | "in-store"
  | "boredom"
  | "other";

export type Outcome = "resisted" | "slipped";

export interface Profile {
  id: string;
  email: string;
  is_pro: boolean;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  timezone: string;
  created_at: string;
}

export interface Rule {
  id: string;
  user_id: string;
  name: string;
  category: Category;
  daily_spend_estimate: number | null;
  current_streak: number;
  longest_streak: number;
  last_checkin_at: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Checkin {
  id: string;
  rule_id: string;
  user_id: string;
  checked_date: string; // YYYY-MM-DD
  held: boolean;
  created_at: string;
}

export interface TemptationLog {
  id: string;
  rule_id: string;
  user_id: string;
  item_name: string;
  category: Category;
  estimated_cost: number | null;
  trigger_source: TriggerSource | null;
  outcome: Outcome;
  logged_at: string;
  acknowledged: boolean;
  created_at: string;
}
