module.exports = {
  up: "CREATE TABLE `sessions` (`session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,`expires` int unsigned NOT NULL,`data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,PRIMARY KEY (`session_id`));",
  down: "DROP TABLE IF EXISTS `sessions`;",
};
