module.exports = {
  up: "CREATE VIEW user_doc AS SELECT u.user_id, u.login, u.password, u.user_role, u.first_name, u.last_name, u.email, d.doc_id, d.document_type, d.document_name, d.exp_date, d.add_date, d.file_link, d.confirmation, u.phone, u.birth_date, u.img_url FROM users u JOIN documents d ON u.user_id = d.user_id;",
  down: "DROP VIEW IF EXISTS `user_doc`;",
};
