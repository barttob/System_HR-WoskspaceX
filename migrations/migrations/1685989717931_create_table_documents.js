module.exports = {
  up: "CREATE TABLE `documents` (`doc_id` int unsigned NOT NULL AUTO_INCREMENT,`user_id` int unsigned NOT NULL,`document_type` varchar(255) NOT NULL,`document_name` varchar(255) NOT NULL,`add_date` datetime NOT NULL,`exp_date` datetime NOT NULL,`file_link` varchar(255) NOT NULL,`confirmation` tinyint(1) NOT NULL DEFAULT '0',PRIMARY KEY (`doc_id`),KEY `documents_user_id_foreign` (`user_id`),CONSTRAINT `documents_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`));",
  down: "DROP TABLE IF EXISTS `documents`;",
};
