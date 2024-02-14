# NodeJS Express Base App

## Summary

Welcome to `NodeJS Express Base App` project, thanks for reading in advance!

This project is a proposal for the base structure of an express application, it has integrated the (in my opinion and experience) mandatory implementations that each express project must have, from documentation to test suite it already is a boiler plate for you to start building your own services of any kind.

## Table of Content:

-   [NodeJS Express Base App](#nodejs-express-base-app)
    -   [Summary](#summary)
    -   [Table of Content:](#table-of-content)
    -   [Project Description:](#project-description)
    -   [Project Structure](#project-structure)
    -   [Proposed Standards](#proposed-standards)
        -   [Logging](#logging)
    -   [Error Handling](#error-handling)
        -   [Tests](#tests)
        -   [Responses](#responses)
        -   [Code Documentation](#code-documentation)
        -   [API Documentation](#api-documentation)
-   [](#)
    -   [Execution](#execution)
        -   [Environment Variables](#environment-variables)
        -   [Pre-requisites](#pre-requisites)
        -   [Installing](#installing)
        -   [Scripts](#scripts)
    -   [Contributing](#contributing)
    -   [License](#license)
    -   [Credits](#credits)

## Project Description:

The project is a proposal of the base structure for an express RESTful API for all the possible adaptations, it has the following integrations to help the developer to start the developing journey with the less possible technical debt covering all the requirements for a high quality development.

| Integration        | Description                                                                                                         | Web Page                                                             |
| ------------------ | ------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `Express`          | Fundamental **web framework** which all this project is based on                                                    | [Express](https://expressjs.com/)                                    |
| `TypeScript`       | Build on Javascript engine to **type the development** of JS making developments more reliable and high quality     | [TypeScript](https://www.typescriptlang.org/)                        |
| `Mocha`            | Testing frameworks that integrates a whole **test suite** for us to develop our unit and integration tests          | [Mocha](https://mochajs.org/)                                        |
| `Isntanbul/nyc`    | Test tool that integrates with Mocha to provide us metrics about our unit/integration tests KPIs (**CodeCoverage**) | [Instanbul](https://github.com/istanbuljs/nyc)                       |
| `Pino`             | **Application logs** framework with support for many configurations and custom logs                                 | [Pino](https://github.com/pinojs/pino)                               |
| `TypeDoc`          | **Documentation** tool that converts Typescript TSDoc comments into HTML **Documentation** for your project         | [TypeDoc](https://typedoc.org/)                                      |
| `SwaggerUIExpress` | **Swagger Documentation** library that helps express to serve a defined swagger.json file into an static file       | [SwaggerUIExpress](https://www.npmjs.com/package/swagger-ui-express) |

There are more libraries implemented in this base project but since they don't cover standard quality points for an application there will be covered when needed along the readme.

To integrate the table information about the implemented frameworks and libraries, this project base app holds an `Express` RESTful API build in `TypeScript`, documented with TSDoc standards using the `TypeDoc` engine and `SwaggerUI` for the endpoints , it generates standard logs defined with `Pino`, the test suite runs over `Mocha` with `Chai` assertions and mocks generated with `Sinon`, `nyc` complements with mocha to generate coverage reports.

## Project Structure

The folder structure of this app is explained below, not tracked folders are generated during the execution of the application.

| Name              | Description                                                                                                  | Git Tracked | Reason                                     |
| ----------------- | ------------------------------------------------------------------------------------------------------------ | ----------- | ------------------------------------------ |
| `.nyc_output`     | Output of the execution of coverage report result                                                            | No          | Generated when coverage script is executed |
| `coverage`        | Result files of coverage report run of nyc                                                                   | No          | Generated when coverage script is executed |
| `dist`            | Contains the distributable (or output) from your TypeScript build.                                           | No          | Generated when app builds                  |
| `documentation`   | Contains the documentation files generated by TypeDoc                                                        | No          | Generated when doc command is executed     |
| `node_modules`    | Contains all npm dependencies                                                                                | No          | Generated when app installs                |
| `public`          | Contains the definition of the swagger documentation file                                                    | Yes         | Required                                   |
| `src`             | Contains source code that will be compiled to the dist dir                                                   | Yes         | Required                                   |
| `src/controllers` | Controllers define functions to serve various express routes then used as handlers for Endpoints definitions | Yes         | Required                                   |
| `src/enums`       | Contains the TypeScript enums defined to be used in application modules                                      | Yes         | Required                                   |
| `src/handlers`    | Contains handlers for specific functionalities common for many modules                                       | Yes         | Required                                   |
| `src/helpers`     | Contains helpers with simpler functionalities to abstract the process from the module that uses it           | Yes         | Required                                   |
| `src/interfaces`  | Contains the TypeScript interfaces defined to be used in application modules                                 | Yes         | Required                                   |
| `src/services`    | Contains the services processes logic itselfs                                                                | Yes         | Required                                   |
| `src/index.ts`    | Entry point to express app, here is where initialization is done                                             | Yes         | Required                                   |
| `test`            | Contains the definition of unit and integration tests for the source code of the application                 | Yes         | Required                                   |
| `.env.example`    | Example of .env file, should be renamed to .env after repository cloning                                     | Yes         | Required                                   |
| `.gitignore`      | Contains the rules of git to ignore some unecessary files and folders                                        | Yes         | Required                                   |
| `package.json`    | Contains the definition of the npm package with its dependencies, configurations and scripts                 | Yes         | Required                                   |
| `readme.md`       | This file itself                                                                                             | Yes         | Required                                   |
| `tsconfig.json`   | Contains the configuration of the TypeScript compiler to correctly work with all the project dependencies    | Yes         | Required                                   |

## Proposed Standards

### Logging

For the application logs we use Pino library, it provides a well structured standard for logs and personalization over the different log levels. The standard is over the INCOMING_REQUEST, OUTCOMING_REQUEST and FAILED_HTTP_REQUEST logs that are implemented as middlewares in the application for every request.

Every incoming request will trigger the INCOMING_REQUEST logger defined in `src/handlers/LogsHandlers.ts`, if the response is success then `OUTCOMING_REQUEST` will log the response, if there is any error then FAILED_HTTP_REQUEST will log the error given with the following `error handling standard`

For custom logs for any need the suggestion is to use the factory function for Pino Logger `createLogger` defined in `src/handlers/LogsHandlers.ts` to generate the logger, the reason is because we want the loggers to have a common base structure, you can configure one defined by you in this function, one example is the logger defined in `src/index.ts` that we use to generate logs of the app initialization process.

## Error Handling

For the error handling the proposal is to use the defined in `src/handlers/CustomError.ts` CustomError class as the unique error format for the application and to sorround every service own process in try/catch clauses that in case of any error first validate if the error is already a CustomError, if it is then just throw the CustomError exception until controllers that pass the CustomError to the `next()` function or if the error is not a CustomError then creates one with the context data and replicate the described steps. Following are the example of a propose try/catch structure for a Service and the final one which is the controller one.

Controller

```ts
try {
    // Any controller process
    const anyService = new AnyProcess();
    const response = await anyService.anyServiceProcess();
    res.status(200).json(response);
} catch (error) {
    // If error is already a CustomError then we just pass it through to the final middleware logger
    if (error instanceof CustomError) next(error);
    // If error its not a CustomError we generate one with our context information that in the controller is just the route called
    next(
        new CustomError(
            EErrorMessage.ANY_ERROR,
            'Unknown error when handling "GET /any-route/"'
        )
    );
}
```

Service

```ts
try {
    // Any service process
    console.log("Hello World");
    return new CustomResponse(ESuccessMessage.SUCCESS_RESPONSE);
} catch (error) {
    // If error its already a CustomError we just pass it through as an exception to the next try/catch
    if (error instanceof CustomError) throw error;
    // If error is not a CustomError we generate one with context data
    throw new CustomError(
        EErrorMessage.GIVEN_ERROR_MESSAGE,
        "Given Error Detail"
    );
}
```

### Tests

For tests the only suggestion is to follow the example structure for the test naming and organizing, for libraries and basic structure as should be for tests there is no standard suggestion, you should do it as required.

Suggested test naming and `describe` organizing

```ts
describe("HealthCheckService.ts", () => {
    describe("#getHealthCheck", () => {
        it("Should return sucess when process is executed correctly", async () => {
            const healthCheckService = new HealthCheckService();
            const response = await healthCheckService.getHealthCheck();

            expect(response).to.eql(
                new CustomResponse(ESuccessMessage.HEALTH_CHECK_OK)
            );
        });
    });
});
```

As you can evidence, the first describe should be the file name to be tested, then another one for each method of the Class or function of the file with a `#` sufix that will indicates that is a function or method. Then, for each test the idea is to follow the convention `Should _______ when ________` to keep the tests expectations and validations clear and readable.

### Responses

The proposed standard for responses is to use the defined classes `CustomError` and `CustomResponse` to handle all the possible outputs of the application based on if the HTTP request was processed succesfully or not. The idea is for you to personalize as you requires the structure, the final suggestion is to use an standard structure for any service consuming the API to know what to expect from a response of any endpoint.

The idea of handling two different status codes is to have a more complex internal status code that starts with the normal status code, for instance `200`, `201` or `403` and then followed for other three digits indicating the `internal status code` of the response, these internal status code should be mapped in the enums of the messages of the `EErrorMessage` enum for errors and `ESuccessMessage` for success responses. This will help the development team to identify more efficiently the errors giving the possibility of more detailed error status codes.

For instance, we can have a 403 response because of many reasons in the application, we can specify each of these different reasons with different internal statusCode, one reason with 403001, another one with 403002. Same happens for success responses.

### Code Documentation

For code documentation the proposed standard is to document as required every module following the TSDoc standards, then, running the `npm run doc` script TypeDoc will automatically generate the documentation for contributors to understand better the functioning of the application, this will help not only developers but any person to understand the functioning of the application.

### API Documentation

For API Documentation is suggested to use the already configure SwaggerUI implementation that works over the OpenAPI standard of definition for APIs, you only have to modify the file `public/swagger.json` to match the description of your application endpoints with many details as desired and every time the application build the swagger file will be visible on the defined route (`/docs` by default).

#

These standards are the basic ones to ensure a high quality software development, highly maintainable and scalable over the time, any change or addition suggestion is warmly welcomed!

## Execution

For the execution of the base project we will see eadch requirement

### Environment Variables

This project uses the following environment variables:

| Name         | Description                      |
| ------------ | -------------------------------- |
| LISTEN_PORT  | Cors accepted values             |
| MICROSERVICE | Name of the defined microservice |

As you can see in the `src/index.ts` file we call the function `validateLocalEnvVariables(localEnvs);`, we pass this function an array with the required env variables to be validated before trying to initialize the application. Its a good idea to add here all the added required environment variables and if needed, define the retrieving of any external secrets repository env variable such as Azure KeyVault or AWS SecretManager to validate with this function the existence and correct retrieval of these secrets too.

### Pre-requisites

-   Install [Node.js](https://nodejs.org/en/) version >= 14.0.0

### Installing

-   Clone the repository

```
git clone  <git lab template url> <project_name>
```

-   Install dependencies

```
cd <project_name>
npm install
```

-   Build and run the project

```
npm run dev
```

Navigate to `http://localhost:8383`

-   API Initial Endpoints

    -   Swagger-UI Endpoint : http://localhost:8383/docs
    -   Example of Failed Request Response : GET http://localhost:8383/express-base-app/v1/health-check
    -   Example of Success Request Response : GET http://localhost:8383/express-base-app/v1/health-check/error

### Scripts

All the different build steps are orchestrated via [npm scripts](https://docs.npmjs.com/misc/scripts).
Npm scripts basically allow us to call (and chain) terminal commands via npm.

There are scripts for production build environments and others for development environments such as our local developing. To run locally your project we use `nodemon` which is a library that help us by watching saved changes over our files and automatically executes a defined script every time our project changes for developing purposes of course. In this case, as your application is build over TypeScript every time we perform changes over the source code we need to `build` the application and executes the resulting build files, for this project `nodemon` is already configured to build the project and run it every time so we just need to call `npm run dev` for our build to run

| Npm Script      | Description                                                                                                         |
| --------------- | ------------------------------------------------------------------------------------------------------------------- |
| `start`         | Builds the application and start the build dist                                                                     |
| `build`         | Generate the build for the application                                                                              |
| `dev`           | Runs nodemon watcher agent that builds and runs the app on changes                                                  |
| `doc`           | Runs the TypeDoc documentation build process, generates the `/documentation` folder with the docs                   |
| `test`          | Runs the test suite                                                                                                 |
| `test:coverage` | Runs the test suite and generates a report coverage based on the nyc configuration defined in the package.json file |

## Contributing

Any positive or more improvement focused comment will be extremely appreciated, please if you want to contribute to the construction of this idea follow these steps:

1. Fork the repo
2. Generate a new branch that describes the contribution
3. Generate as many changes as you want
4. Generate a PR to master branch with your changes
5. It will be reviewed, in any required case I will contact you to resolve doubts and hopefully to complete the merge

Thanks a lot in advance

## License

MIT License

Copyright (c) [2024] [Fabio Anaya]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Credits

Of course for all the library and framework developers here included and for anyone who tooked the time to read this. Thanks a lot.
