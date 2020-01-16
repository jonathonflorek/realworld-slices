# Realworld-Slices

A Realworld.io backend following SOLID architecture in slices, not layers.

https://github.com/jonathonflorek/realworld-slices

This project is also a personal exercise in NodeJS integration testing.

Express + TypeORM + Postgres

## How to develop

When running locally, the server is launched with environment variables provided in the `/.env` file. A sample is provided in `/examples`. Tests are run with environment variables in `/test.env` - make sure these point to different databases or the test runner will truncate your debugging database.

Key NPM scripts:
- `npm start`: builds and starts
- `npm run migration:revert`: reverts the most recently applied TypeORM migration.
- `npm run migration:generate <name>`: builds the application, runs all existing migrations, and then generates a new migration to apply changes to the schema in `src/models`.
- `npm run migration:run`: builds the application and runs all migrations
- `npm test`: runs unit and integration tests
- `npm run test:unit`: runs unit tests only
- `npm run test:integration`: runs integration tests only

TypeORM is configured to use the same environment variables in `/.env` as the running application uses.

## How is this SRP in SOLID?

Lasagne architecture suffers from a problem where repositories need to return different columns of an object depending on what it's used for. For example:

```
interface SampleRepository {
    getSample(id: string): Sample
    getSamplesForUseCaseA(id: string, code: number): Sample[]
    getSampleForUseCaseB(key: string): Sample
    ...
}
```

This is not SRP as it has at least two reasons to change: Use Case A and B.

While every feature has to be modified if we change database drivers in this project's layout, we can iteratively migrate features one-by-one to new drivers in small commits instead of a big bang refactoring of all the repositories at once in a long-running branch.

This explanation is a very brief overview of concepts disussed in much greater clarity in [this](https://vimeo.com/131633177) talk.

## See Also

[The talk by the inventor of onion architecture that inspired this project and explains how this can be SOLID](https://vimeo.com/131633177)

[A dotnet project that inspired the directory layout of this project](https://github.com/jbogard/ContosoUniversityDotNetCore)

[A node project used as a basis for nodejs integration testing](https://github.com/nt-ca-aqe/blog-microservices-testing-nodejs-typescript/blob/master/package.json)
