

## Description

Project Developed to Submit for Pickles Auctions - Coding Interview 

### Task Description
Build a highly available emailing microservice.
The service should:
- Accepts a payload via API / Consume events
- Sends email via email delivery services

### Acceptance Criteria 

- Write your service in TypeScript.
- Submit your assignment as a Git repository hosted on any SCM.
- Include a README explaining how to install dependencies and run your application.
- Your README should also include architecture details.
- Include unit and/or integration tests and instructions for running them.
- Explain any compromises/shortcuts you made due to time considerations.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```
# Note:

Due to timeline constraint below thing have been not taken care off
- Hard coded the config of Email Service, can move this to config so can support Multiple Environments.
- For better and secure way we can use AWS SQS but for testing purpose I have user emailGun.
## Stay in touch

- Author - [Chandramohan](chandram97@gmail.com)

