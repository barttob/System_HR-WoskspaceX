# System HR - WoskspaceX

WorkspaceX  - a platform for managing employees, document and hours billing for staffing agencies.

## Prerequisites

Requirements for the software
- [node.js - 18.15](https://nodejs.org/en/blog/release/v18.15.0)
- [MySQL - 8.0.32](https://dev.mysql.com/downloads/installer/)

## Built With

  - [React.js](https://react.dev/)
  - [Express.js](https://expressjs.com/)
  - [MySQL](https://www.mysql.com/)

## Installing
### Server

First install all server packages

    cd server
    npm i

After the packages have been installed start the server

    npm start


### Client 

First install all client packages

    cd client
    npm i

After the packages have been installed start the client

    npm run dev

### Database 

Set mysql root password to 'password'.

Login in to mysql database and run the following

    ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';

Create database, use your own folder path

    mysql -u root -p -t < /path/to/System_HR-WoskspaceX/workspacex.sql


### Data to login

pracownik - login: Colt56, password: Colt56

księgowa - login: Frankie66, password: Frankie66

opiekun - login: Nella29, password: Nella29

admin - login: Karolann.Breitenberg, password: Karolann.Breitenberg

## Authors

  - **Łukasz Skraba**
  - **Bartosz Tobiasz**
