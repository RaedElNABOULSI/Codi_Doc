DROP TABLE IF EXISTS tasks;
CREATE TABLE tasks (
	task_id integer,
	link text,
	type integer,
	name text,
	isRepeatable integer DEFAULT 0
);

DROP TABLE IF EXISTS task_propreties;
CREATE TABLE task_propreties (
	task_id integer,
	skill_id integer,
	key_range integer,
	FOREIGN KEY(task_id) 
    REFERENCES tasks(task_id) 
	FOREIGN KEY(skill_id) 
    REFERENCES skill_table(skill_id) 
);
