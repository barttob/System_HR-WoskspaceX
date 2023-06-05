module.exports = {
  up: "CREATE TABLE `jobs` (`job_id` int unsigned NOT NULL AUTO_INCREMENT,`client_id` int unsigned NOT NULL,`name` varchar(255) NOT NULL,`description` varchar(255) NOT NULL,`emp_quantity` int NOT NULL,`start_date` datetime NOT NULL,`end_date` datetime NOT NULL,`status` varchar(255) NOT NULL,PRIMARY KEY (`job_id`),KEY `jobs_client_id_foreign` (`client_id`),CONSTRAINT `jobs_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients` (`client_id`));",
  down: "DROP TABLE IF EXISTS `jobs`;",
};
