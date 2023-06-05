module.exports = {
  up: "CREATE TABLE `workspacex_log` (`id` int NOT NULL AUTO_INCREMENT,`by_user` int unsigned NOT NULL,`timestamp_log` timestamp NOT NULL,`action_type` varchar(255) NOT NULL,`log_details` text,PRIMARY KEY (`id`))",
  down: "DROP TABLE IF EXISTS `workspacex_log`;",
};
