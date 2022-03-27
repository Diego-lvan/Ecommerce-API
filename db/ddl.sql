CREATE DATABASE store;
USE store;
CREATE TABLE product(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR (40) NOT NULL,
    price DOUBLE NOT NULL,
    description VARCHAR(300) NOT NULL,
    stock INTEGER(6) NOT NULL,
    brand VARCHAR(25) NOT NULL,
    color JSON
);

