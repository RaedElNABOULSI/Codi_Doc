const queryList = [
  // Users
  {
    USER_INS: `INSERT INTO user_account (firstname, lastname, email, phoneNumber, auth0_sub) VALUES
      ($firstname, $lastname, $email, $phoneNumber, $auth0_sub)`,
    USER_UPD: `UPDATE user_account SET firstname = $firstname, lastname = $lastname, email = $email, phoneNumber = $phoneNumber WHERE user_id = @id`,
    USER_BAN: `UPDATE user_account SET disabled = 1 WHERE user_id = @id`,
    USER_SEL: `SELECT * FROM user_account WHERE user_id = ?`,
    USER_SEL_ALL: `SELECT * FROM user_account`,

    USER_LINKS_INS: `INSERT INTO user_links (user_id, link_type, link, last_update) VALUES (
      $user_id, $link_type, $link, $last_update)`,
    USER_LINKS_SEL: `SELECT * FROM user_links WHERE user_id = ?`,
    USER_LINKS_DEL: `DELETE FROM user_links WHERE user_id = ? and link = ?`,
    USER_LINKS_UPD: `UPDATE user_links SET link = $link WHERE user_id = @id and rowId = ?`,

    USER_SKILLS_INS: `INSERT INTO user_skills (user_id, skill_id, value) VALUES ($user_id, $skill_id, $value)`,
    USER_SKILLS_UPD: `UPDATE user_skills SET value = $value WHERE user_id = $user_id and skill_id = $skill_id`,
    USER_SKILLS_SEL: `SELECT * FROM user_skills WHERE user_id = ?`,

    USER_COMPETENCIES_INS: `INSERT INTO user_competencies (user_id, competencie_id, value) VALUES ($user_id, $competencie_id, $value)`,
    USER_COMPETENCIES_UPD: `UPDATE user_competencies SET value = $value WHERE user_id = ? AND competencie_id = ?`,
    USER_COMPETENCIES_SEL: `SELECT * FROM user_competencies WHERE user_id = ?`,

    USER_NOTES_INS:`INSERT INTO user_notes (note_id, mentor_id, user_id, type, id, comment)`,
    USER_NOTES_UPD:`UPDATE user_notes SET type = $type, id = $id, comment = $comment WHERE note_id = ?` ,
    USER_NOTES_DEL:`DELETE FROM user_notes WHERE note_id = ?`,
    USER_NOTES_SEL:`SELECT * FROM user_notes WHERE user_id = ?`,
    USER_NOTES_SEL_ALL:`SELECT * FROM user_notes`,
    // USER_ASSIGNMENT_INS: `INSERT INTO user_assignment `, TODO
  },
  // ATTENDANCES
  {
    ATTENDANCE_INS: `INSERT INTO user_attendance (user_id, date, time, status, reason, key_amount) VALUES
      ($user_id, $date, $time, $status, $reason, $key_amount)`,
    ATTENDANCE_UPD: `UPDATE user_attendance SET time = $time, status = $status, reason = $reason WHERE user_id = ? and date = ?`,
    ATTENDANCE_STREAK_UPD: `UPDATE user_attendance_streak SET streak = $streak, max_streak = $max_streak WHERE user_id = ?`,
  },
  // ASSIGNMENTS
  {
    ASSIGNMENT_INS: `INSERT INTO assignment (mentor_id, task_id, link, message, startDate, endDate) VALUES
      ($mentor_id, $task_id, $link, $message, $startDate, $endDate)`,
    ASSIGNMENT_DEL: `DELETE FROM assignment WHERE assignment_id = ?`,
    ASSIGNMENT_UPD: `UPDATE assignment SET task_id = $task_id, link = $link, message = $message, startDate = $startDate, endDate = $endDate
      WHERE assignment_id = ?`,
    ASSIGNMENT_SEL: `SELECT * FROM assignment WHERE assignment_id = ?`,
    ASSIGNMENT_SEL_ALL: `SELECT * FROM assignment WHERE endDate < ?`,
  },
  // GROUPS
  {
    GROUP_INS: `INSERT INTO groups (group_type, group_name, project_id) VALUES
      ($group_type, $group_name, $project_id)`,
    GROUP_DISABLE: `UPDATE groups SET disabled = 1 WHERE group_id = ?`,
    GROUP_MEMBER_INS: `INSERT INTO group_members (group_id, user_id) VALUES ($group_id, $user_id)`,
    GROUP_MEMBER_DEL: `DELETE FROM group_members WHERE group_id = ? AND user_id = ?`
  },
  // TASKS
  {
    TASK_INS: `INSERT INTO tasks (link, type, name, key_range, isRepeatable) VALUES
    ($link, $type, $name, $key_range, $isRepeatable)`,
    TASK_DEL: `DELETE FROM tasks WHERE task_id = ?`,

    TASK_PROPERTIES_INS:`INSERT INTO task_properties (task_id, skill_id) VALUES 
    ($task_id, $skill_id)`,
    TASK_PROPERTIES_DEL:`DELETE FROM task_properties WHERE task_id = ? AND skill_id = ?`
  },
  // PROJECTS
  {
    PROJECT_INS: `INSERT INTO projects (project_name) VALUES ($project_name)`,
    PROJECT_DEL: `DELETE FROM projects WHERE project_id = ?`,
    PROJECT_TASK_INS: `INSERT INTO projects_tasks (project_id, task_id) VALUES ($project_id, $task_id)`,
    PROJECT_TASK_DEL: `DELETE FROM projects_task WHERE task_id = ? AND project_id = ?`,
    PROJECT_COMPETENCIES_INS: `INSERT INTO project_competencies (project_id, skill_id) VALUES ($project_id, $skill_id)`,
    PROJECT_COMPETENCIES_DEL: `DELETE FROM project_competencies WHERE project_id = ? AND skill_id = ?`,
  },
  // SKILLS
  {
    SKILL_INS: `INSERT INTO skill_table (name, max_value, isStackable) VALUES
    ($name, $max_value, $isStackable)`,
    SKILL_UPD: `UPDATE skill_table SET name = $name, max_value = $max_value, isStackable = $isStackable WHERE skill_id = ?`,
    SKILL_DEL: `DELETE FROM skill_table WHERE skill_id = ?`,
  },
];

const prepareStmt = db => {
  try {
    let stmt = [];

    queryList.forEach(element => {
      for (const key in element) {
        stmt[key] = db.prepare(element[key]);
      }
    });

    return stmt;
  } catch (e) {
    console.log(`prepareStmt : ${e}`);
  }
};

const executeToDatabase = stmt => {
  try {
    // this is shit. change this thanks.
    const SELECT = id => {
      return id ? stmt.get(id) : stmt.get();
    };

    const SELECT_ALL = id => {
      return id ? stmt.all(id) : stmt.all();
    };

    const INSERT = props => {
      const result = stmt.run({
        ...props
      });
      return result;
    };

    const UPDATE = (id, props) => {
      props.id = id;
      const result = stmt.run({
        ...props
      });
      return result.changes;
    };

    const DELETE = id => {
      const result = stmt.run(id);
      return result.changes;
    };

    const QueryCenter = {
      SELECT,
      SELECT_ALL,
      INSERT,
      UPDATE,
      DELETE
    };

    return QueryCenter;
  } catch (e) {
    console.log(`preparedQueries error ${e}`);
  }
};

export { prepareStmt, executeToDatabase };
