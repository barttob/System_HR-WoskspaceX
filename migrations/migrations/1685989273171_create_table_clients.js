module.exports = {
  up: "CREATE TABLE `clients` (`client_id` int unsigned NOT NULL AUTO_INCREMENT,`first_name` varchar(255) NOT NULL,`last_name` varchar(255) NOT NULL,`email` varchar(255) NOT NULL,`phone` varchar(255) NOT NULL,PRIMARY KEY (`client_id`))",
  down: "DROP TABLE IF EXISTS `clients`;",
};
