# Northcoders News API

This project aims to replicate the behaviour of a back-end API service to access data.

## Cloning

To clone the project, in your terminal set to your chosen directory, run the command `git clone https://github.com/AlexMan123456/nc-project`

## Required Dependencies

To successfully run this project, you will need to install the following dependencies:
- dotenv (required for connection with Render) (minimum version required: 16.4.5)
- express (required for managing requests to the server) (minimum version required: 4.21.1)
- pg (required for making connections to the database) (minimum version required: 8.7.3)
- nodemon (required to make the server listen for requests) (minimum version required: 3.1.7)

You will also need the following developer dependencies:
- jest (required for testing) (minimum version required: 27.5.1)
- jest-sorted (required for tests that check if an array has been sorted in some particular order) (minimum version required: 1.0.15)
- supertest (required for the testing suite to make requests to the server) (minimum version required: 7.0.0)

You will need at least version 22.3.0 of node.js to run the project.

## Seeding Local Databases

To set up the test and developer databases, first run `npm run setup-dbs` in the terminal.

In the server.test.js file, the test data seeding will be done automatically before each test.

To use the developer data, first run `npm run seed` in the terminal to seed the data. After that, you may run the command `npm run start` to start up the server and make it listen for requests.

## Running the Tests

There are two test files - one for utility functions required for seeding, named 'utils.test.js', and one for testing the server itself, named 'server.test.js'. To run both test files at the same time, just type into terminal `npm test`. Alternatively, to run just the utils tests, run `npm test utils`, and to test just the server, run `npm test server`.

## Creating the .env files

In the main directory, create the files `.env.development` and `.env.test`. This will allow you to set the development and test databases respectively. In each, set the PGDATABASE environment variable accordingly.

## Link to Hosted Version

https://northcoders-project-khyr.onrender.com

--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
