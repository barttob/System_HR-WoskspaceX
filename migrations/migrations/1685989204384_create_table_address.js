module.exports = {
  up: "CREATE TABLE `address` (`address_id` int unsigned NOT NULL AUTO_INCREMENT,`address1` varchar(255) NOT NULL,`address2` varchar(255) NOT NULL,`postal_code` varchar(255) NOT NULL,`country` varchar(255) NOT NULL,`city` varchar(255) NOT NULL,`type` enum('own','foreign') NOT NULL DEFAULT 'own',PRIMARY KEY (`address_id`));",
  down: "DROP TABLE IF EXISTS `address`;",
};
