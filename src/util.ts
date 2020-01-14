export const resultFactory = <T>() => <K extends keyof T>(
    type: K,
    payload: T[K],
) => ({
    type,
    payload,
});
