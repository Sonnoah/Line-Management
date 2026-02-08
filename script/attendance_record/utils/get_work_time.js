import { WORK_TIME_BY_DEPARTMENT } from "./work_time_config";

export function getWorkTime(department) {
  return (
    WORK_TIME_BY_DEPARTMENT[department] ||
    WORK_TIME_BY_DEPARTMENT["Office"] 
  );
}
