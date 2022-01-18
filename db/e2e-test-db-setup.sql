CREATE DATABASE impthingstestdata;
USE impthingstestdata;

CREATE USER 'impthingse2e'@'localhost' IDENTIFIED BY 'D|pP3|_G||!ger';
GRANT ALL PRIVILEGES ON *.* TO 'impthingse2e'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;
