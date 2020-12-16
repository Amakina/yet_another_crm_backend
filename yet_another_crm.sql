-- --------------------------------------------------------
-- Хост:                         127.0.0.1
-- Версия сервера:               10.3.10-MariaDB - mariadb.org binary distribution
-- Операционная система:         Win64
-- HeidiSQL Версия:              9.4.0.5125
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Дамп структуры базы данных yet_another_crm
CREATE DATABASE IF NOT EXISTS `yet_another_crm` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `yet_another_crm`;

-- Дамп структуры для таблица yet_another_crm.companies
CREATE TABLE IF NOT EXISTS `companies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `phone` varchar(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `ogrn` varchar(13) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ogrn` (`ogrn`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

-- Экспортируемые данные не выделены.
-- Дамп структуры для таблица yet_another_crm.customers
CREATE TABLE IF NOT EXISTS `customers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `ogrn` varchar(13) NOT NULL,
  `inn` varchar(10) NOT NULL,
  `address` varchar(255) NOT NULL,
  `phone` varchar(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `org_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `SECONDARY_KEY` (`org_id`,`ogrn`),
  CONSTRAINT `customer_org_id` FOREIGN KEY (`org_id`) REFERENCES `companies` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8;

-- Экспортируемые данные не выделены.
-- Дамп структуры для таблица yet_another_crm.deals
CREATE TABLE IF NOT EXISTS `deals` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `deal_id` varchar(10) NOT NULL DEFAULT '0',
  `org_id` int(11) NOT NULL,
  `manager_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `deal_date` date NOT NULL,
  `finish_date` date NOT NULL,
  `status` varchar(30) NOT NULL DEFAULT 'Принят к исполнению',
  PRIMARY KEY (`id`),
  UNIQUE KEY `deal_number` (`deal_id`),
  KEY `deals_org_id` (`org_id`),
  KEY `deals_user_id` (`manager_id`),
  KEY `deals_customer_id` (`customer_id`),
  CONSTRAINT `deals_customer_id` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  CONSTRAINT `deals_org_id` FOREIGN KEY (`org_id`) REFERENCES `companies` (`id`),
  CONSTRAINT `deals_user_id` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`),
  CONSTRAINT `finish_bigger_deal` CHECK (`deal_date` < `finish_date`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8;

-- Экспортируемые данные не выделены.
-- Дамп структуры для представление yet_another_crm.deals_view
-- Создание временной таблицы для обработки ошибок зависимостей представлений
CREATE TABLE `deals_view` (
	`id` INT(11) NULL,
	`org_id` INT(11) NULL,
	`deal_id` VARCHAR(10) NOT NULL COLLATE 'utf8_general_ci',
	`status` VARCHAR(30) NOT NULL COLLATE 'utf8_general_ci',
	`deal_date_not_formated` DATE NOT NULL,
	`finish_date_not_formated` DATE NOT NULL,
	`deal_date` VARCHAR(10) NULL COLLATE 'utf8mb4_general_ci',
	`finish_date` VARCHAR(10) NULL COLLATE 'utf8mb4_general_ci',
	`customer_name` VARCHAR(255) NULL COLLATE 'utf8_general_ci',
	`customer_id` INT(11) NULL,
	`service_id` INT(11) NULL,
	`service_name` VARCHAR(100) NULL COLLATE 'utf8_general_ci',
	`quantity` INT(11) NULL,
	`final_sum` DECIMAL(42,0) NULL
) ENGINE=MyISAM;

-- Дамп структуры для таблица yet_another_crm.deal_services
CREATE TABLE IF NOT EXISTS `deal_services` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `service_id` int(11) NOT NULL,
  `deal_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `deal_action_action_id` (`service_id`),
  KEY `deal_action_deal_id` (`deal_id`),
  CONSTRAINT `deal_action_action_id` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`),
  CONSTRAINT `deal_action_deal_id` FOREIGN KEY (`deal_id`) REFERENCES `deals` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=utf8;

-- Экспортируемые данные не выделены.
-- Дамп структуры для таблица yet_another_crm.events
CREATE TABLE IF NOT EXISTS `events` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `org_id` int(11) NOT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp(),
  `description` varchar(255) NOT NULL,
  `responsible_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `SECONDARY_KEY` (`date`,`responsible_id`),
  KEY `schedule_org_id` (`org_id`),
  CONSTRAINT `schedule_org_id` FOREIGN KEY (`org_id`) REFERENCES `companies` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

-- Экспортируемые данные не выделены.
-- Дамп структуры для представление yet_another_crm.events_view
-- Создание временной таблицы для обработки ошибок зависимостей представлений
CREATE TABLE `events_view` (
	`id` INT(11) NOT NULL,
	`date` VARCHAR(21) NULL COLLATE 'utf8mb4_general_ci',
	`date_not_formated` DATETIME NOT NULL,
	`description` VARCHAR(255) NOT NULL COLLATE 'utf8_general_ci',
	`responsible_id` INT(11) NULL,
	`org_id` INT(11) NOT NULL,
	`name` VARCHAR(255) NULL COLLATE 'utf8_general_ci'
) ENGINE=MyISAM;

-- Дамп структуры для представление yet_another_crm.not_paid
-- Создание временной таблицы для обработки ошибок зависимостей представлений
CREATE TABLE `not_paid` (
	`id` INT(11) NULL,
	`org_id` INT(11) NULL,
	`deal_id` VARCHAR(10) NOT NULL COLLATE 'utf8_general_ci',
	`status` VARCHAR(30) NOT NULL COLLATE 'utf8_general_ci',
	`deal_date` VARCHAR(10) NULL COLLATE 'utf8mb4_general_ci',
	`finish_date` VARCHAR(10) NULL COLLATE 'utf8mb4_general_ci',
	`customer_name` VARCHAR(255) NULL COLLATE 'utf8_general_ci',
	`customer_id` INT(11) NULL,
	`service_id` INT(11) NULL,
	`service_name` VARCHAR(100) NULL COLLATE 'utf8_general_ci',
	`quantity` INT(11) NULL,
	`final_sum` DECIMAL(42,0) NULL,
	`paid` DECIMAL(32,0) NULL
) ENGINE=MyISAM;

-- Дамп структуры для таблица yet_another_crm.payments
CREATE TABLE IF NOT EXISTS `payments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `org_id` int(11) NOT NULL,
  `deal_id` int(11) NOT NULL,
  `receipt` varchar(100) NOT NULL,
  `date` datetime NOT NULL,
  `sum` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `payment_deal_id` (`deal_id`),
  KEY `payment_ord_id` (`org_id`),
  CONSTRAINT `payment_deal_id` FOREIGN KEY (`deal_id`) REFERENCES `deals` (`id`),
  CONSTRAINT `payment_ord_id` FOREIGN KEY (`org_id`) REFERENCES `companies` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

-- Экспортируемые данные не выделены.
-- Дамп структуры для представление yet_another_crm.payments_view
-- Создание временной таблицы для обработки ошибок зависимостей представлений
CREATE TABLE `payments_view` (
	`org_id` INT(11) NOT NULL,
	`id` INT(11) NOT NULL,
	`deal_id` INT(11) NOT NULL,
	`receipt` VARCHAR(100) NOT NULL COLLATE 'utf8_general_ci',
	`date` VARCHAR(21) NULL COLLATE 'utf8mb4_general_ci',
	`sum` INT(11) NOT NULL,
	`deal_name` VARCHAR(10) NULL COLLATE 'utf8_general_ci'
) ENGINE=MyISAM;

-- Дамп структуры для представление yet_another_crm.regulars
-- Создание временной таблицы для обработки ошибок зависимостей представлений
CREATE TABLE `regulars` (
	`org_id` INT(11) NULL,
	`id` INT(11) NULL,
	`customer_name` VARCHAR(255) NULL COLLATE 'utf8_general_ci',
	`num_deals` BIGINT(21) NOT NULL,
	`amount` DECIMAL(64,0) NULL,
	`last_deal_not_formated` DATE NULL,
	`deal_date` VARCHAR(10) NULL COLLATE 'utf8mb4_general_ci'
) ENGINE=MyISAM;

-- Дамп структуры для таблица yet_another_crm.services
CREATE TABLE IF NOT EXISTS `services` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(10) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `price` int(11) NOT NULL,
  `org_id` int(11) NOT NULL,
  `status` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `actions_org_id` (`org_id`),
  CONSTRAINT `actions_org_id` FOREIGN KEY (`org_id`) REFERENCES `companies` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8;

-- Экспортируемые данные не выделены.
-- Дамп структуры для таблица yet_another_crm.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` char(60) NOT NULL,
  `role` int(11) NOT NULL DEFAULT 1,
  `org_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `org_id` (`org_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

-- Экспортируемые данные не выделены.
-- Дамп структуры для триггер yet_another_crm.after_deal_delete
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `after_deal_delete` AFTER DELETE ON `deals` FOR EACH ROW BEGIN
	DELETE FROM customers WHERE customers.id NOT IN
	(SELECT customers.id FROM deals
	LEFT JOIN customers ON customers.id = deals.customer_id);
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Дамп структуры для триггер yet_another_crm.before_deal_delete
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `before_deal_delete` BEFORE DELETE ON `deals` FOR EACH ROW BEGIN
	DELETE FROM deal_services
	WHERE deal_services.deal_id = OLD.id;
	DELETE FROM payments
	WHERE payments.deal_id = OLD.id;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Дамп структуры для представление yet_another_crm.deals_view
-- Удаление временной таблицы и создание окончательной структуры представления
DROP TABLE IF EXISTS `deals_view`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` VIEW `deals_view` AS SELECT 
r.id, r.org_id, r.deal_id, r.status, 
r.deal_date AS deal_date_not_formated,
r.finish_date AS finish_date_not_formated,
DATE_FORMAT(r.deal_date, N'%d.%m.%Y') AS deal_date,
DATE_FORMAT(r.finish_date, N'%d.%m.%Y') AS finish_date,
r.customer_name,
r.customer_id, r.service_id, r.service_name, r.quantity, SUM(r.final_sum) AS final_sum
FROM (
	SELECT c.org_id, d.id, d.deal_id, 
	d.status, d.deal_date, d.finish_date, c.name AS customer_name, 
	c.id AS customer_id, s.id AS service_id, s.name AS service_name, 
	ds.quantity,s.price * ds.quantity AS final_sum
	FROM deals AS d
	LEFT JOIN customers AS c on c.id = d.customer_id
	LEFT JOIN deal_services AS ds on ds.deal_id = d.id
	LEFT JOIN services AS s on s.id = ds.service_id
) AS r
GROUP BY r.id, service_name WITH ROLLUP ;

-- Дамп структуры для представление yet_another_crm.events_view
-- Удаление временной таблицы и создание окончательной структуры представления
DROP TABLE IF EXISTS `events_view`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` VIEW `events_view` AS SELECT events.id, DATE_FORMAT(date, N'%d.%m.%Y %H:%i') AS date, date AS date_not_formated, description, responsible_id, events.org_id, users.name FROM events LEFT JOIN users ON users.id = events.responsible_id ;

-- Дамп структуры для представление yet_another_crm.not_paid
-- Удаление временной таблицы и создание окончательной структуры представления
DROP TABLE IF EXISTS `not_paid`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` VIEW `not_paid` AS SELECT deals_view.*, COALESCE(SUM(payments.sum), 0) AS paid
FROM deals_view
LEFT JOIN payments ON payments.deal_id = deals_view.id
WHERE deals_view.service_name IS NULL AND deals_view.id IS NOT NULL
GROUP BY deals_view.id HAVING paid < deals_view.final_sum OR paid IS NULL ;

-- Дамп структуры для представление yet_another_crm.payments_view
-- Удаление временной таблицы и создание окончательной структуры представления
DROP TABLE IF EXISTS `payments_view`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` VIEW `payments_view` AS SELECT payments.org_id, payments.id, payments.deal_id, receipt, DATE_FORMAT(date, N'%d.%m.%Y %H:%i') AS date, sum, deals.deal_id AS deal_name FROM payments
LEFT JOIN deals ON deals.id = payments.deal_id ;

-- Дамп структуры для представление yet_another_crm.regulars
-- Удаление временной таблицы и создание окончательной структуры представления
DROP TABLE IF EXISTS `regulars`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` VIEW `regulars` AS SELECT 
org_id,
customer_id AS id, customer_name, 
COUNT(customer_id) AS num_deals, SUM(final_sum) AS amount, 
MAX(deal_date_not_formated) AS last_deal_not_formated,
DATE_FORMAT(MAX(deal_date_not_formated), N'%d.%m.%Y') AS deal_date
FROM deals_view
WHERE service_name IS NULL AND id IS NOT NULL
GROUP BY customer_id
HAVING num_deals > 2 AND DATEDIFF(last_deal_not_formated, NOW()) < 1095 ;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
