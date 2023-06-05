module.exports = {
  up: "CREATE TRIGGER after_insert_clients AFTER INSERT ON clients FOR EACH ROW BEGIN INSERT INTO workspacex_log (by_user, timestamp_log, action_type, log_details) VALUES (111, NOW(), 'INSERT', CONCAT('Dodano klienta przez kadrowego: client_id = ', NEW.client_id)); END;",
  down: "DROP TRIGGER IF EXISTS after_insert_clients;",
};
