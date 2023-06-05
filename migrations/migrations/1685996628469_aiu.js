module.exports = {
  up: "CREATE TRIGGER after_insert_users AFTER INSERT ON users FOR EACH ROW BEGIN INSERT INTO workspacex_log (by_user, timestamp_log, action_type, log_details) VALUES (111, NOW(), 'INSERT', CONCAT('Dodano przez kadrowego pracownika: user_id = ', NEW.user_id)); END;",
  down: "DROP TRIGGER IF EXISTS after_insert_users;",
};
