import React, { useState, useEffect } from 'react';
import axios from 'axios';

import 'components/Application.scss';
import Appointment from 'components/Appointment';
import 'components/Appointment/styles.scss';
import {
  getAppointmentsForDay,
  getInterviewersForDay,
  getInterview,
} from 'components/helpers/selectors';

import DayList from './DayList';

export default function Application(props) {
  const setDay = (day) => setState({ ...state, day });

  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: [],
  });

  const appointments = getAppointmentsForDay(state, state.day);
  const interviewers = getInterviewersForDay(state, state.day);

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    setState({
      ...state,
      appointments,
    });
  }

  function deleteInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };
    setState({
      ...state,
      appointments,
    });
  }

  const schedule = appointments.map((appointment) => {
    const interview = getInterview(state, appointment.interview);

    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={interview}
        bookInterview={bookInterview}
        deleteInterview={deleteInterview}
        interviewers={interviewers}
      />
    );
  });

  useEffect(() => {
    const getDays = 'http://localhost:8001/api/days';
    const getAppointments = 'http://localhost:8001/api/appointments';
    const getInterviewers = 'http://localhost:8001/api/interviewers';
    Promise.all([
      axios.get(getDays),
      axios.get(getAppointments),
      axios.get(getInterviewers),
    ]).then((all) => {
      setState((prev) => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data,
      }));
    });
  }, []);

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={state.days} day={state.day} setDay={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {schedule}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
