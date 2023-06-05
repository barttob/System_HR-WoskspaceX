module.exports = {
  up: "CREATE VIEW user_address AS SELECT u.user_id, u.login, u.password, u.user_role, u.first_name, u.last_name, u.email, a.address_id, a.address1, a.address2, a.postal_code, a.country, a.city, u.phone, u.birth_date, u.img_url FROM users u JOIN address a ON u.address_id = a.address_id;",
  down: "DROP VIEW IF EXISTS `user_address`;",
};
