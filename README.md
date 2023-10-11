# Backend Project 1

## Project environments

Development

- Run with: `npm run dev-server` or `npm run dev`

## Architecture

The following project follows a simplifed variant of the clean architecture. It organize features using vertical slicing

## Infrastructure

### Main libraries

- MongpDB Client
- NestJS
- Joi

## Env vars

Before running the project, create the necessary env files located in `env-vars` folder.

## Requirements

- Nodejs 14 or greater

## Notes

- Authentication is mocked by passing the app user ID in the authorization header instead of a token
- The controllers can be found in all files ending with .controller.ts
- This project is focused more on the crud part, It does not contain any form of authentication
- Even though there is no authentication sometimes permissions validations are considered
- There is no exhaustive check on the integrity of data relating to products, orders and restaurants. Example: an order with several products from different restaurants.
- Examples of how to consume the API are inside the folder `test-endpoints`
