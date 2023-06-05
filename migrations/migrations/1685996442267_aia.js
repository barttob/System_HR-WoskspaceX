module.exports = {
  up: "CREATE TRIGGER after_insert_accomodation AFTER INSERT ON accomodation FOR EACH ROW BEGIN INSERT INTO workspacex_log (by_user, timestamp_log, action_type, log_details) VALUES (NEW.sv_id, NOW(), 'INSERT', CONCAT('Przypisano mieszkanie przez opiekuna: acc_id = ', NEW.acc_id)); END;",
  down: "DROP TRIGGER IF EXISTS after_insert_accomodation;",
};
