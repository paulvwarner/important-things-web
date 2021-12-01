CREATE DATABASE impthingsdata;
USE impthingsdata;

CREATE USER 'impthingsuser'@'localhost' IDENTIFIED BY 'D0pP3|_G@|!ger';
GRANT ALL PRIVILEGES ON *.* TO 'impthingsuser'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;
