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

After the packages have been installed start server

    npm start


### Client 

First install all client packages

    cd client
    npm i

After the packages have been installed start server

    npm run dev

### Database 

Manually create the database named 'workspacex', then install for migrations packages

    cd migrations
    npm i

After the packages have been installed run migrations

    node migration.js up --migrate-all

## Authors

  - **Łukasz Skraba**
  - **Bartosz Tobiasz**
