show databases;
CREATE DATABASE myapp;
USE myapp;
show tables;

CREATE TABLE foods (id INT AUTO_INCREMENT,name VARCHAR(50), "Typical values per" DECIMAL(5, 2) unsigned, Unit of the typical value: VARCHAR(10), Carbs per DECIMAL(5, 2) unsigned, Unit of the carbs: VARCHAR(10), Fat per DECIMAL(5, 2) unsigned, Unit of the fat: VARCHAR(10), Protein per DECIMAL(5, 2) unsigned, Unit of the protein: VARCHAR(10), PRIMARY KEY(id));
