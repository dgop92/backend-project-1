# Backend Project 1

## Project environments

Development

- Run with: `npm run dev-server` or `npm run dev`

## Architecture

The following project follows a simplifed variant of the clean architecture. It organize features using vertical slicing

## Infrastructure

### Main libraries

- MongoDB Client
- NestJS
- Joi

## Env vars

Before running the project, create the necessary env files located in `env-vars` folder.
For development, create inside `env-vars` a file called `.env.dev` and copy the content of `.dev.env.example` into it.

## Requirements

- Nodejs 14 or greater

## Notes

- Authentication is mocked by passing the app user ID in the authorization header instead of a token
- The controllers can be found in all files ending with .controller.ts
- This project is focused more on the CRUD part, It does not contain any form of authentication
- Even if there is no authentication, permission validations are sometimes considered.
- There is no strong validation on data integrity related to products, orders and restaurants. Example: an order with several products from different restaurants.
- To keep it simple, every time an order status changes to delivered, the restaurant's popularity increases by one. A better way to implement this functionality is to use a cron job that finds all delivered orders and sets the correct popularity for all restaurants.
- Examples of how to consume the API are inside the folder `test-endpoints`
