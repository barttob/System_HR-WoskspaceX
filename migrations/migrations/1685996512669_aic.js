module.exports = {
  up: "CREATE TRIGGER after_insert_contracts AFTER INSERT ON contracts FOR EACH ROW BEGIN INSERT INTO workspacex_log (by_user, timestamp_log, action_type, log_details) VALUES (111, NOW(), 'INSERT', CONCAT('Dodano kontrakt przez kadrowego: contract_id = ', NEW.contract_id)); END;",
  down: "DROP TRIGGER IF EXISTS after_insert_contracts;",
};
