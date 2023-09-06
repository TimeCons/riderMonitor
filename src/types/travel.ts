export interface TravelData {
  _id?: string;
  travel_address?: string;
  travel_estimed_time_minutes?: number;
  travel_distance?: string;
  travel_expected_arrival_time?: string;
  travel_arrival?: string;
  travel_expected_return_time?: string;
  travel_departure?: string;
  travel_is_complete?: boolean;
  travel_status?: "progress" | "completed" | "canceled";
  travel_rider?: string;
  travel_elapsed_time?: string;
}
