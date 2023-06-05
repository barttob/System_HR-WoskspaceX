module.exports = {
  up: "CREATE TRIGGER after_insert_applications AFTER INSERT ON emp_applications FOR EACH ROW BEGIN INSERT INTO workspacex_log (by_user, timestamp_log, action_type, log_details) VALUES (NEW.user_id, NOW(), 'INSERT', CONCAT('Wyslano wniosek: app_id = ', NEW.app_id, ' przez pracownika user_id = ', NEW.user_id)); END;",
  down: "DROP TRIGGER IF EXISTS after_insert_applications;",
};
