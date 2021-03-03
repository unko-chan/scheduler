import React from 'react';
import Header from 'components/Appointment/Header.js';
import Show from 'components/Appointment/Show.js';
import Empty from 'components/Appointment/Empty.js';
import Confirm from 'components/Appointment/Confirm.js';
import useVisualMode from 'components/hooks/useVisualMode';
import Form from 'components/Appointment/Form.js';
import Status from 'components/Appointment/Status.js';
import Error from 'components/Appointment/Error.js';

const EMPTY = 'EMPTY';
const SHOW = 'SHOW';
const CREATE = 'CREATE';
const CONFIRM = 'CONFIRM';
const EDIT = 'EDIT';
const SAVING = 'SAVING';
const DELETING = 'DELETING';
const SAVING_ERROR = 'SAVING_ERROR';
const DELETING_ERROR = 'DELETING_ERROR';

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  async function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer,
    };
    try {
      transition(SAVING);
      await props.bookInterview(props.id, interview);
      transition(SHOW);
    } catch (err) {
      transition(SAVING_ERROR);
    }
  }

  async function onDelete(confirm) {
    transition(CONFIRM);
    if (confirm) {
      try {
        transition(DELETING);
        await props.deleteInterview(props.id);
        transition(EMPTY);
      } catch (err) {
        transition(DELETING_ERROR);
      }
    }
  }

  function onEdit() {
    transition(EDIT);
    console.log(props.interview);
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
      {mode === SAVING && <Status message="Saving" />}
      {mode === DELETING && <Status message="Deleting" />}
      {mode === SAVING_ERROR && (
        <Error message="Saving Error" onClose={() => back()} />
      )}
      {mode === DELETING_ERROR && (
        <Error message="Deleting Error" onClose={() => back()} />
      )}
    </article>
  );
}
