CREATE DATABASE myapp;
USE myapp;

CREATE TABLE foods (id INT AUTO_INCREMENT,name VARCHAR(50), Typical_values_per DECIMAL(5, 2) unsigned, Unit_of_the_typical_value VARCHAR(10), Carbs_per DECIMAL(5, 2) unsigned, Unit_of_the_carbs VARCHAR(10), Fat_per DECIMAL(5, 2) unsigned, Unit_of_the_fat VARCHAR(10), Protein_per DECIMAL(5, 2) unsigned, Unit_of_the_protein VARCHAR(10), PRIMARY KEY(id));

CREATE TABLE users(firstName varchar(50) NOT NULL, lastName varchar(50) NOT NULL, userName varchar(50) NOT NULL unique, emailAddress varchar(50) NOT NULL, password varchar(255) NOT NULL, PRIMARY KEY(emailAddress));


INSERT INTO foods (name, Typical_values_per, Unit_of_the_typical_value, Carbs_per, Unit_of_the_carbs, Fat_per, Unit_of_the_fat, Protein_per, Unit_of_the_protein) VALUES ('Apple', 0.5, 'piece', 0.12, 'g', 0.17, 'g', 0.26, 'g');

INSERT INTO foods (name, Typical_values_per, Unit_of_the_typical_value, Carbs_per, Unit_of_the_carbs, Fat_per, Unit_of_the_fat, Protein_per, Unit_of_the_protein) VALUES ('Banana', 1, 'piece', 0.23, 'g', 0.12, 'g', 0.33, 'g');

CREATE USER 'appuser'@'localhost' IDENTIFIED WITH mysql_native_password BY 'app2027';
GRANT ALL PRIVILEGES ON myapp.* TO 'appuser'@'localhost';