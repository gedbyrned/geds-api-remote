# Northcoders News API

--- 

Welcome to my project!

A link to the hosted version. HERE 

This project is an api api build for the purpose of accessing application data programatically, to mimic the building of a real world backend service (such as Reddit) which should provide this information to the front end architecture.

Clear instructions of how to clone, install dependencies, seed local database, and run tests.

To clone this project:

1. Visit the github page listed.
2. Select clone and copy the URL.
3. In the terminal on VSCode, type: git clone <insert-url-here>

Install the following dependencies in the terminal: 

- npm install dotenv
- npm install express
- npm install pg
- npm install pg-database
- npm install pg-format
- npm install --save-dev jest-sorted

To seed the local database:


To run tests:

- Use the command: npm test __tests__/api.test.js 

You will also have to creat to .env files: 

1. Create two new files: .env.test and .env.development 
2. Into each, add PGDATABASE=, with the correct database name for that environment. Refer to the setup.sql if unsure on the database names.
3. Add the two new .env files to the .gitignore file. 

The minimum version of Node.js needed to run this project is >=6.0.0. 
The minimumum version of Postgres need to run the project




---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
