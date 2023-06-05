module.exports = {
  up: "CREATE TRIGGER after_insert_documents AFTER INSERT ON documents FOR EACH ROW BEGIN INSERT INTO workspacex_log (by_user, timestamp_log, action_type, log_details) VALUES (111, NOW(), 'INSERT', CONCAT('Dodano dokument przez kadrowego: doc_id = ', NEW.doc_id, ' dotyczacy pracownika user_id = ', NEW.user_id)); END;",
  down: "DROP TRIGGER IF EXISTS after_insert_documents;",
};
