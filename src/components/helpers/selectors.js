export function getInterview(state, interview) {
  if (interview) {
    const newInterview = {
      ...interview, 
      interviewer: state.interviewers[interview.interviewer]
    }
    return newInterview;
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

export function getInterviewersForDay(state, day) {
  const filteredDays = state.days.filter((dayList) => dayList.name === day);
  if (!filteredDays.length) {
    return filteredDays;
  }
  const appIds = filteredDays[0].appointments;
  const filteredApps = appIds.map((id) => state.interviewers[id]);
  return filteredApps;
}
