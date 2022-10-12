export interface Case {
  ClientName: string;
  Pronouns: string;
  ID: number;
  URN: number;
  PreferredContact: string;
  Status: string;
  Group: string;
  EligibilityStartDate: string;
  EligibilityEndDate: string;
}

export interface Screen {
  screen_id: number;
  name: string;
  url: string;
  active_flag: string;
  create_user: string;
  create_date: Date;
  last_update_user: string;
  last_update_date: Date;
}

export interface ScreenFlow {
  screen_flow_id: number;
  screen_flow_name: string;
  screen_flow_type_code: string;
  program_id: number;
  active_flag: string;
  create_user: string;
  create_date: Date;
  last_update_user: string;
  last_update_date: Date;
}

export interface ScreenFlowProgress {
  screen_flow_progress_id: number;
  screen_flow_step_id: number;
  current_screen_flag: string;
  visited_flag: string;
  user_id: number;
  case_id: number;
  client_case_eligibility_id: number;
  create_user: string;
  create_date: Date;
  last_update_user: string;
  last_update_date: Date;
  first_visited_date: Date;
}

export interface ScreenFlowStep {
  screen_flow_step_id: number;
  screen_flow_id: number;
  screen_id: number;
  sequence_nbr: number;
  screen_flow_step_type_code: string;
  active_flag: string;
  create_user: string;
  create_date: Date;
  last_update_user: string;
  last_update_date: Date;
}

export interface ScreenData {
  // screen_id: number;
  name: string;
  url: string;
  // active_flag: string;
  // create_user: string;
  // create_date: Date;
  // last_update_user: string;
  // last_update_date: Date;

  // screen_flow_step_id: number;
  // screen_flow_id: number;
  // screen_id: number;
  sequence_nbr: number;
  screen_flow_step_type_code: string;
  // active_flag: string;
  // create_user: string;
  // create_date: Date;
  // last_update_user: string;
  // last_update_date: Date;

  // screen_flow_progress_id: number;
  // screen_flow_step_id: number;
  current_screen_flag?: string;
  visited_flag?: string;
  // user_id?: number;
  // case_id?: number;
  // client_case_eligibility_id?: number;
  // create_user: string;
  // create_date: Date;
  // last_update_user: string;
  // last_update_date: Date;
  // first_visited_date: Date;
}
