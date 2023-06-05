module.exports = {
  up: "CREATE TRIGGER after_insert_job_assign AFTER INSERT ON jobs_assigment FOR EACH ROW BEGIN INSERT INTO workspacex_log (by_user, timestamp_log, action_type, log_details) VALUES (111, NOW(), 'INSERT', CONCAT('Przypisano przez kadrowego pracownika: user_id = ', NEW.user_id, ' do etatu: jobassg_id: ', NEW.jobassg_id)); END;",
  down: "DROP TRIGGER IF EXISTS after_insert_job_assign;",
};
