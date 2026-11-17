export interface AlertPreferences {
  keywords?: string[];
  exclusion_keywords?: string[];
  categories?: string[];
  /** 'all' | 'states' | 'cities' (see LocationSelector). */
  location_type?: string;
  selected_states?: string[];
  selected_cities?: string[];
  project_value_min?: number | null;
  project_value_max?: number | null;
  tender_types?: string[];
  show_expired?: boolean;
  match_score_threshold?: number;
  channels?: string[];
  frequency?: string;
  quiet_hours?: {
    enabled: boolean;
    from: string;
    to: string;
  };
}

export type UpdateAlertField = <K extends keyof AlertPreferences>(field: K, value: AlertPreferences[K]) => void;

/** Props shared by every alert-preference editor component. */
export interface AlertFieldProps {
  preferences: AlertPreferences;
  updateField: UpdateAlertField;
}
