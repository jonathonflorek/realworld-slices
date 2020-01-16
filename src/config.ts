export const secret = required('REALWORLD_SECRET');

export const postgresConfig = {
    type: 'postgres' as const,
    port: Number(required('POSTGRES_PORT')),
    host: required('POSTGRES_HOST'),
    database: required('POSTGRES_DATABASE'),
    username: required('POSTGRES_USERNAME'),
    password: required('POSTGRES_PASSWORD'),
}

function required(name: string) {
    const result = process.env[name];
    if (!result) {
        throw new Error(`environment variable ${name} is required`);
    }
    return result;
}
