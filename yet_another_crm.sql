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

-- Дамп данных таблицы yet_another_crm.companies: ~0 rows (приблизительно)
/*!40000 ALTER TABLE `companies` DISABLE KEYS */;
INSERT INTO `companies` (`id`, `name`, `phone`, `email`, `address`, `ogrn`) VALUES
	(7, 'ИП "Сентякова М.А"', '89630307864', 'company@mail.com', 'Студенческая, 7', '1234567891234');
/*!40000 ALTER TABLE `companies` ENABLE KEYS */;

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

-- Дамп данных таблицы yet_another_crm.customers: ~8 rows (приблизительно)
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` (`id`, `name`, `ogrn`, `inn`, `address`, `phone`, `email`, `org_id`) VALUES
	(26, 'ИП "Сентякова М.А."', '1234567891234', '1234567891', 'Студенческая, 7', '89630307864', 'sentyakova@mail.com', 7),
	(27, 'ИП "Гафина Ю.А."', '1234567891235', '1234567892', 'Строительная, 22', '89129195580', 'gafina@mail.com', 7),
	(28, 'ИП "Русаева Е.В."', '1234567891236', '1234567893', 'Ягулевская, 1а', '89128653419', 'rusaeva@mail.com', 7),
	(29, 'ООО "Пример"', '1234567891237', '1234567894', 'Примеровская, 25', '89445670012', 'example@mail.com', 7),
	(31, 'ООО "Загадка"', '1234567891238', '1234567895', 'Волшебная, 0', '88005553535', 'fairy@hogwarts.com', 7),
	(32, 'ООО "Строитель"', '1234567891239', '1234567898', 'Строительная, 100', '89124437654', 'builder@build.com', 7),
	(33, 'ООО "Паста"', '7564839456784', '5647348965', 'Макаронная, 18', '89445678813', 'pasta@italy.com', 7),
	(34, 'ООО "Тестовое предприятие"', '5758495674985', '5764895677', 'г. Ижевск, ул. Тестовая, 18 ', '89126578812', 'test@mail.com', 7);
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;

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

-- Дамп данных таблицы yet_another_crm.deals: ~11 rows (приблизительно)
/*!40000 ALTER TABLE `deals` DISABLE KEYS */;
INSERT INTO `deals` (`id`, `deal_id`, `org_id`, `manager_id`, `customer_id`, `deal_date`, `finish_date`, `status`) VALUES
	(19, 'ДГ200000', 7, 3, 26, '2020-12-15', '2021-01-31', 'Работы завершены'),
	(20, 'ДГ200001', 7, 3, 27, '2020-12-16', '2021-01-08', 'Принят к исполнению'),
	(21, 'ДГ200002', 7, 3, 28, '2020-12-18', '2021-01-15', 'Принят к исполнению'),
	(22, 'ДГ200003', 7, 3, 29, '2020-12-24', '2021-01-09', 'Принят к исполнению'),
	(23, 'ДГ200004', 7, 3, 31, '2020-12-29', '2020-12-30', 'Принят к исполнению'),
	(24, 'ДГ200005', 7, 3, 32, '2020-12-31', '2021-01-16', 'Принят к исполнению'),
	(25, 'ДГ200006', 7, 3, 33, '2021-01-01', '2021-01-06', 'Принят к исполнению'),
	(26, 'ДГ200007', 7, 3, 26, '2020-12-23', '2020-12-31', 'Принят к исполнению'),
	(27, 'ДГ210008', 7, 3, 26, '2020-12-18', '2021-07-14', 'Принят к исполнению'),
	(28, 'ДГ200009', 7, 3, 31, '2020-12-16', '2020-12-24', 'Принят к исполнению'),
	(29, 'ДГ200010', 7, 3, 34, '2020-12-16', '2021-03-02', 'Принят к исполнению'),
	(30, 'ДГ200011', 7, 3, 34, '2020-12-17', '2020-12-24', 'Принят к исполнению');
/*!40000 ALTER TABLE `deals` ENABLE KEYS */;

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

-- Дамп данных таблицы yet_another_crm.deal_services: ~23 rows (приблизительно)
/*!40000 ALTER TABLE `deal_services` DISABLE KEYS */;
INSERT INTO `deal_services` (`id`, `service_id`, `deal_id`, `quantity`) VALUES
	(55, 14, 20, 123),
	(56, 15, 20, 54),
	(57, 16, 20, 123),
	(58, 18, 21, 10),
	(59, 10, 22, 115),
	(60, 12, 22, 134),
	(61, 15, 22, 112),
	(62, 13, 23, 50),
	(63, 14, 23, 50),
	(64, 9, 24, 100),
	(65, 12, 25, 34),
	(66, 15, 26, 10),
	(67, 16, 26, 10),
	(68, 14, 27, 120),
	(69, 9, 19, 100),
	(70, 10, 19, 89),
	(71, 11, 19, 89),
	(72, 12, 19, 89),
	(73, 17, 28, 12),
	(78, 9, 29, 123),
	(79, 10, 29, 123),
	(80, 11, 29, 123),
	(81, 12, 29, 123),
	(82, 13, 30, 10);
/*!40000 ALTER TABLE `deal_services` ENABLE KEYS */;

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

-- Дамп данных таблицы yet_another_crm.events: ~3 rows (приблизительно)
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` (`id`, `org_id`, `date`, `description`, `responsible_id`) VALUES
	(6, 7, '2020-12-16 12:00:00', 'Встреча с ООО "Тестовое предприятие"', 3),
	(7, 7, '2020-12-14 13:20:00', 'Обсуждение стратегии предприятия', 7),
	(8, 7, '2020-12-24 19:30:00', 'Встреча с ООО "Волшебство"', 3),
	(10, 7, '2020-12-18 00:00:00', 'Протестировать Yet Another CRM', 3),
	(11, 7, '2020-12-17 00:00:00', 'Новое событие2', 7);
/*!40000 ALTER TABLE `events` ENABLE KEYS */;

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

-- Дамп данных таблицы yet_another_crm.payments: ~5 rows (приблизительно)
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` (`id`, `org_id`, `deal_id`, `receipt`, `date`, `sum`) VALUES
	(4, 7, 19, '1234567', '2020-12-15 18:40:00', 2213000),
	(5, 7, 21, '7487647', '2020-12-30 21:04:00', 35000),
	(6, 7, 21, '5876847', '2021-01-08 16:08:00', 15000),
	(7, 7, 21, '54756756', '2021-01-07 22:03:00', 10000),
	(8, 7, 29, '75648486', '2020-12-17 15:18:00', 500000),
	(9, 7, 22, '12334646', '2020-12-24 00:00:00', 1567),
	(10, 7, 26, '64576576', '2020-12-17 00:00:00', 3534);
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;

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

-- Дамп данных таблицы yet_another_crm.services: ~12 rows (приблизительно)
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` (`id`, `code`, `name`, `description`, `price`, `org_id`, `status`) VALUES
	(9, 'ПД000', 'Демонтаж', 'Разборка (демонтаж) зданий и сооружений, стен, перекрытий, лестничных маршей и иных конструктивных и связанных с ними элементов или их частей', 7000, 7, 0),
	(10, 'CC000', 'Свайные работы', 'Устройство забивных и буронабивных свай', 6000, 7, 0),
	(11, 'УК000', 'Устройство конструкций', 'Устройство монолитных бетонных и железобетонных конструкций', 5000, 7, 0),
	(12, 'МК000', 'Монтаж конструкций', 'Монтаж фундаментов и конструкций подземной части зданий и сооружений, монтаж элементов конструкций надземной части зданий и сооружений, в том числе колонн, рам, ригелей, ферм, балок, плит, поясов, панелей стен и перегородок, Монтаж объемных блоков, в том числе вентиляционных блоков, шахт лифтов и мусоропроводов, санитарно-технических кабин', 6000, 7, 0),
	(13, 'МК001', 'Монтаж металлических конструкций', 'Монтаж, усиление и демонтаж конструктивных элементов и ограждающих конструкций зданий и сооружений, Монтаж, усиление и демонтаж технологических конструкций', 8000, 7, 0),
	(14, 'МК002', 'Монтаж деревянных конструкций', 'Монтаж, усиление и демонтаж конструктивных элементов и ограждающих конструкций зданий и сооружений, в том числе из клееных конструкций', 7000, 7, 0),
	(15, 'ЗК000', 'Защита конструкций', 'Защита строительных конструкций, трубопроводов и оборудования (кроме магистральных и промысловых трубопроводов)', 4000, 7, 0),
	(16, 'КР000', 'Устройство кровель', 'Устройство кровель', 3000, 7, 0),
	(17, 'ФР000', 'Фасадные работы', 'Облицовка поверхностей природными и искусственными камнями и линейными фасонными камнями', 3000, 7, 0),
	(18, 'УВС000', 'Устройство внутренних инженерных систем и оборудования зданий и сооружений', 'Устройство и демонтаж системы водопровода и канализации, Устройство и демонтаж системы отопления, Устройство и демонтаж системы газоснабжения, Устройство и демонтаж системы вентиляции и кондиционирования воздуха,\nУстройство системы электроснабжения, Устройство электрических и иных сетей управления системами жизнеобеспечения зданий и сооружений', 7000, 7, 0),
	(19, 'ЭС001', 'Устройство наружных электрических сетей и линий связи', 'Устройство сетей электроснабжения напряжением до 330 кВ включительно, Установка распределительных устройств, коммутационной аппаратуры, устройств защиты', 9500, 7, 0),
	(21, 'ПП111', 'Промышленные печи и дымовые трубы', 'Кладка верхнего строения ванных стекловаренных печей. Монтаж печей из сборных элементов повышенной заводской готовности. Электролизеры для алюминиевой промышленности. Футеровка промышленных дымовых и вентиляционных печей и труб.', 11111, 7, 0);
/*!40000 ALTER TABLE `services` ENABLE KEYS */;

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

-- Дамп данных таблицы yet_another_crm.users: ~2 rows (приблизительно)
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `org_id`) VALUES
	(3, 'Сентякова Мария Александровна', 'mymail@mail.com', '$2b$10$IOh7t8ArwzwO02GmAiGAju1aYtY7b7InROzroMpdi0dTmn4SOfLju', 3, 7),
	(7, 'Рабочих Роман Романович', 'myworker01@mail.com', '$2b$10$X0jmkx.bGh6Et5LFQe19XuPLMxMUsIJnGHTtIY9SZ.F4eXFwpXClm', 2, 7);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

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
