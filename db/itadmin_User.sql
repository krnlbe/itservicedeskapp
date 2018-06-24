-- MySQL dump 10.13  Distrib 5.7.20, for Linux (x86_64)
--
-- Host: localhost    Database: itadmin
-- ------------------------------------------------------
-- Server version	5.7.20-0ubuntu0.16.04.1

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
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `User` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `created` datetime NOT NULL,
  `lastLogin` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES (1,'itadmin','it','admin','itadmin@itadmin.com','0ef35d4cd2027a1e54dac7c588f62792','2018-04-01 16:08:37','2018-04-17 10:59:16'),(4,'test','test','test','test@test.com','098f6bcd4621d373cade4e832627b4f6','2018-04-16 16:31:09','2018-06-24 16:52:43'),(5,'jallen','John','Allen','jallen@test.com','098f6bcd4621d373cade4e832627b4f6','2018-05-15 16:15:31','2018-06-24 17:28:55'),(6,'jlee','Jane','Lee','jlee@test.com','098f6bcd4621d373cade4e832627b4f6','2018-05-15 16:16:15','2018-05-15 16:16:15'),(7,'mthom','Mark','Thomson','mthom@test.com','098f6bcd4621d373cade4e832627b4f6','2018-05-15 16:17:12','2018-05-15 16:17:12'),(8,'tuom','Tuomas','Liitmatainen','tliit@test.com','098f6bcd4621d373cade4e832627b4f6','2018-05-15 16:17:56','2018-06-24 17:00:13'),(9,'jensl','Jens','Lehmann','jensl@test.com','098f6bcd4621d373cade4e832627b4f6','2018-05-15 16:18:35','2018-06-24 16:53:53'),(10,'carlam','Carla','Mangini','cmang@test.com','098f6bcd4621d373cade4e832627b4f6','2018-05-15 16:19:12','2018-06-24 17:46:55'),(11,'bmor','Brigitte','Morceau','bmor@test.com','098f6bcd4621d373cade4e832627b4f6','2018-05-15 16:19:56','2018-05-15 16:19:56'),(12,'dnic','Daniel','Nicholson','dani@example.com','1588b3bd03133321a4f442700fb7ade1','2018-06-24 16:44:44','2018-06-24 16:44:44'),(13,'mjohn','Michael','Johnson','mjohn@extreme.com','aced56123174f05110eb5669c4a31c35','2018-06-24 16:45:26','2018-06-24 16:45:34'),(14,'vpaul','Vera','Paulson','vpaul@test.com','2f7b9ee26189ed4cbd1cca010b1f762a','2018-06-24 16:47:30','2018-06-24 16:47:55');
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-06-24 18:04:02
