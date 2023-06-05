module.exports = {
  up: "CREATE TRIGGER after_insert_salaries AFTER INSERT ON salaries FOR EACH ROW BEGIN INSERT INTO workspacex_log (by_user, timestamp_log, action_type, log_details) VALUES (111, NOW(), 'INSERT', CONCAT('Dodano wyplate: salary_id = ', NEW.user_id, ' pracownika: user_id = ', NEW.user_id)); END;",
  down: "DROP TRIGGER IF EXISTS after_insert_salaries;",
};
