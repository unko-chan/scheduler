import React from 'react';
import Header from 'components/Appointment/Header.js';
import Show from 'components/Appointment/Show.js';
import Empty from 'components/Appointment/Empty.js';
import Confirm from 'components/Appointment/Confirm.js';
import useVisualMode from 'components/hooks/useVisualMode';
import Form from 'components/Appointment/Form.js';

const EMPTY = 'EMPTY';
const SHOW = 'SHOW';
const CREATE = 'CREATE';
const CONFIRM = 'CONFIRM';
const EDIT = 'EDIT'

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer,
    };
    props.bookInterview(props.id, interview);
    transition(SHOW);
  }

  function onDelete(confirm) {
    transition(CONFIRM);
    if (confirm) {
      transition(EMPTY);
      props.deleteInterview(props.id);
    }
  }

  function onEdit() {
    transition(EDIT);
    console.log(props.interview)
  }

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer.name}
          onDelete={() => onDelete()}
          onEdit={() => onEdit()}
        />
      )}
      {mode === CONFIRM && (
        <Confirm
          onCancel={() => transition(back)}
          onConfirm={() => onDelete(true)}
          message="Are you sure you would like to delete?"
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onCancel={() => back()}
          onSave={save}
        />
      )}
      {mode === EDIT && (
        <Form
          name={props.interview.student}
          interviewer={props.interview.interviewer.id}
          interviewers={props.interviewers}
          onCancel={() => back()}
          onSave={save}
        />
      )}
    </article>
  );
}
