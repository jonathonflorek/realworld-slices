# Realworld-Slices

A Realworld.io backend following SOLID architecture in slices, not layers.

https://github.com/jonathonflorek/realworld-slices

This project is also a personal exercise in NodeJS integration testing.

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
