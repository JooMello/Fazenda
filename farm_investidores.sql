-- MySQL dump 10.13  Distrib 8.0.31, for Win64 (x86_64)
--
-- Host: localhost    Database: farm
-- ------------------------------------------------------
-- Server version	8.0.30

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `investidores`
--

DROP TABLE IF EXISTS `investidores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `investidores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(120) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `phone` varchar(25) NOT NULL,
  `email` varchar(120) NOT NULL,
  `cpf` varchar(15) NOT NULL,
  `cep` varchar(12) NOT NULL,
  `logradouro` varchar(45) NOT NULL,
  `uf` varchar(45) NOT NULL,
  `cidade` varchar(45) NOT NULL,
  `number` varchar(45) NOT NULL,
  `obs` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `investidores`
--

LOCK TABLES `investidores` WRITE;
/*!40000 ALTER TABLE `investidores` DISABLE KEYS */;
INSERT INTO `investidores` VALUES (4,'Marcelo Maia','Marcelo-Maia','65993589187','email.test@gamil.com','045185353543','53543','sfasf','SP','VG','11411','sgsg','2022-11-22 12:32:24','2022-11-22 12:32:24'),(5,'Aline Safira','Aline-Safira','3252352523','ajnfajs@gmail.com','23235325235','23523','Rua 10','Sp','Sp','12','wdgsd','2022-11-22 16:40:02','2022-11-22 16:40:02'),(6,'João Victor Mello','Joao-Victor-Mello','65993589187','jvssmello@gmail.com','07769260124','78110002','Av Castelo Branco','Mato Grosso','Várzea Grande','1170','E-stilo Contabilidade','2022-11-22 17:24:50','2022-11-22 17:24:50');
/*!40000 ALTER TABLE `investidores` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-11-22 17:34:46
