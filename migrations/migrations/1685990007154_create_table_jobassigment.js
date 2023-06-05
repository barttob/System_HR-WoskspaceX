module.exports = {
  up: "CREATE TABLE `jobs_assigment` (`jobassg_id` int unsigned NOT NULL AUTO_INCREMENT,`job_id` int unsigned NOT NULL,`user_id` int unsigned NOT NULL,`add_date` datetime NOT NULL,`contract_id` int unsigned NOT NULL,PRIMARY KEY (`jobassg_id`),KEY `jobs_assigment_job_id_foreign` (`job_id`),KEY `jobs_assigment_contract_id_foreign` (`contract_id`),KEY `jobs_assigment_user_id_foreign` (`user_id`),CONSTRAINT `jobs_assigment_contract_id_foreign` FOREIGN KEY (`contract_id`) REFERENCES `contracts` (`contract_id`),CONSTRAINT `jobs_assigment_job_id_foreign` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`job_id`),CONSTRAINT `jobs_assigment_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`));",
  down: "DROP TABLE IF EXISTS `jobs_assigment`;",
};
