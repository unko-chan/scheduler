export function getInterview(state, interview) {
  if (interview) {
    interview.interviewer = state.interviewers[interview.interviewer];
    return interview;
  } else {
    return null;
  }
}

export function getAppointmentsForDay(state, day) {
  const filteredDays = state.days.filter((dayList) => dayList.name === day);
  if (!filteredDays.length){
    return filteredDays
  }
  const appIds = filteredDays[0].appointments
  const filteredApps = appIds.map((id) => (state.appointments[id]));
  return filteredApps;
}
