-- MySQL dump 10.13  Distrib 5.7.21, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: itadmin
-- ------------------------------------------------------
-- Server version	5.7.21-0ubuntu0.16.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Issue`
--

DROP TABLE IF EXISTS `Issue`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Issue` (
  `idIssue` int(11) NOT NULL AUTO_INCREMENT,
  `summary` varchar(200) NOT NULL,
  `description` varchar(200) NOT NULL,
  `priority` varchar(45) NOT NULL,
  `reporter` int(11) NOT NULL,
  `assignee` int(11) NOT NULL,
  `status` varchar(45) NOT NULL,
  `attach` varchar(100) DEFAULT NULL,
  `created` datetime NOT NULL,
  `updated` datetime DEFAULT NULL,
  `severity` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idIssue`),
  KEY `fk_assignee_idx` (`reporter`,`assignee`),
  KEY `fk_assignee_id` (`assignee`),
  CONSTRAINT `fk_assignee_id` FOREIGN KEY (`assignee`) REFERENCES `User` (`id`),
  CONSTRAINT `fk_reporter_id` FOREIGN KEY (`reporter`) REFERENCES `User` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Issue`
--

LOCK TABLES `Issue` WRITE;
/*!40000 ALTER TABLE `Issue` DISABLE KEYS */;
INSERT INTO `Issue` VALUES (7,'Not able to log in','My account is locked and I cannot log into the app.','Urgent',4,1,'OPEN','NULL','2018-05-14 14:58:10','2018-05-14 14:58:10','Problem'),(8,'Cannot see the Dashboard page','The link to the Dashboard page is not available. The error message is \"500 Server Error\".','High',4,1,'OPEN','NULL','2018-05-14 14:59:31','2018-05-14 14:59:31','Problem'),(9,'Can I use Skype for communicating with client?','I have a Skype meeting in 3 hours and Skype for Business isn\'t working properly. I\'m not able to start a video conference.','Urgent',4,1,'IN PROGRESS','config.js','2018-05-14 15:11:31','2018-05-14 17:11:15','Question'),(10,'Printer burst on fire','While printing some work related documents smoke rose from the printer.','Urgent',4,8,'CLOSED','favicon.ico','2018-05-14 15:15:51','2018-05-14 15:15:51','Incident'),(11,'Search button missing.','The Search button is missing from the navbar.','Low',4,1,'OPEN','NULL','2018-05-14 15:23:35','2018-05-14 15:23:35','Problem'),(12,'Desk phone isn\'t working.','The VoIP doesn\'t work properly.','Low',4,1,'OPEN','NULL','2018-05-14 15:24:41','2018-05-16 13:25:28','Incident');
/*!40000 ALTER TABLE `Issue` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-06-08 17:35:33
