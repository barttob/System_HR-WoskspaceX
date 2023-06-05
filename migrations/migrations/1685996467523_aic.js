module.exports = {
  up: "CREATE TRIGGER after_insert_calendar AFTER INSERT ON calendar FOR EACH ROW BEGIN INSERT INTO workspacex_log (by_user, timestamp_log, action_type, log_details) VALUES (111, NOW(), 'INSERT', CONCAT('Dodano wydarzenie przez kadrowego: event_id = ', NEW.event_id, 'dla pracownika: user_id = ', NEW.user_id)); END;",
  down: "DROP TRIGGER IF EXISTS after_insert_calendar;",
};
