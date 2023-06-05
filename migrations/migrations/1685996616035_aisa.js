module.exports = {
  up: "CREATE TRIGGER after_insert_sv_assign AFTER INSERT ON supervisor_assigment FOR EACH ROW BEGIN INSERT INTO workspacex_log (by_user, timestamp_log, action_type, log_details) VALUES (111, NOW(), 'INSERT', CONCAT('Przypisano przez kadrowego opiekuna: sv_id = ', NEW.sv_id, ' pracownikowi: user_id = ', NEW.user_id)); END;",
  down: "DROP TRIGGER IF EXISTS after_insert_sv_assign;",
};
