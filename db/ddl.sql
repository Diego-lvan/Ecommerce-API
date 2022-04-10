CREATE DATABASE store;
USE store;
CREATE TABLE product(
    productID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR (40) NOT NULL,
    price DOUBLE NOT NULL,
    stock INTEGER(6) NOT NULL,
    brand VARCHAR(25) NOT NULL,
    rating FLOAT(4)
);

CREATE TABLE user(
    userID INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(50) UNIQUE NOT NULL,
    pwd VARCHAR(80) NOT NULL,
    isAdmin BOOLEAN DEFAULT 0
);

CREATE TABLE sale(
    saleID VARCHAR(80),
    userID INT NOT NULL,
    productID INT NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
    delivered BOOLEAN DEFAULT FALSE,
    succeded BOOLEAN DEFAULT FALSE,
    quantity INT NOT NULL,
    subTotal FLOAT NOT NULL,
    PRIMARY KEY(saleID,productID),
    FOREIGN KEY (productID) REFERENCES product(productID),
    FOREIGN KEY (userID) REFERENCES user(userID)
    );

CREATE TABLE review(
    productID INT,
    userID INT,
    title VARCHAR(20) NOT NULL,
    review VARCHAR(300) NOT NULL,
    rate INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP() NOT NULL,
    updatedAt TIMESTAMP NULL,
    PRIMARY KEY (userID,productID),
    FOREIGN KEY (productID) REFERENCES product(productID) ON CASCADE DELETE,
    FOREIGN KEY (userID) REFERENCES user(userID) ON CASCADE DELETE
);