module.exports = {
  up: "CREATE TRIGGER after_insert_jobs AFTER INSERT ON jobs FOR EACH ROW BEGIN INSERT INTO workspacex_log (by_user, timestamp_log, action_type, log_details) VALUES (111, NOW(), 'INSERT', CONCAT('Dodano nowy etat przez kadrowego: job_id = ', NEW.job_id)); END;",
  down: "DROP TRIGGER IF EXISTS after_insert_jobs;",
};
