# Realworld-Slices

A Realworld.io backend following SOLID architecture in slices, not layers.

https://github.com/jonathonflorek/realworld-slices

This project is also a personal exercise in NodeJS integration testing.

Express + TypeORM + Postgres

## How to develop

When running locally, the server is launched with environment variables provided in the `/.env` file. A sample is provided in `/examples`. Tests are run with environment variables in `/test.env` - make sure these point to different databases or the test runner will truncate your debugging database.

Key NPM scripts:
`npm start`: builds and starts
`npm run migration:revert`: reverts the most recently applied TypeORM migration.
`npm run migration:generate <name>`: builds the application, runs all existing migrations, and then generates a new migration to apply changes to the schema in `src/models`.
`npm run migration:run`: builds the application and runs all migrations
`npm test`: runs unit and integration tests
`npm run test:unit`: runs unit tests only
`npm run test:integration`: runs integration tests only

TypeORM is configured to use the same environment variables in `/.env` as the running application uses.

## How is this SRP in SOLID?

Lasagne architecture suffers from a problem where repositories need to return different columns of an object depending on what it's used for. For example:

```
interface SampleRepository {
    getSample(id: string): Sample
    getSamplesForUseCaseA(id: string, code: number): Sample[]
    getSampleForUseCaseB(key: string): Sample
}
```

This is single-responsibility in terms of its layer (data access) but not SRP in terms of what it does. The approach in this project is the opposite: it is SRP in terms of use case but not in terms of layer. If the above interface is SRP then this project is what you get when you say 'reverse the polarity'.

## See Also

[The talk by the inventor of onion architecture that inspired this project and explains how this can be SOLID](https://vimeo.com/131633177)

[A dotnet project that inspired the directory layout of this project](https://github.com/jbogard/ContosoUniversityDotNetCore)

[A node project used as a basis for nodejs integration testing](https://github.com/nt-ca-aqe/blog-microservices-testing-nodejs-typescript/blob/master/package.json)
