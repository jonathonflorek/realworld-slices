import { randomBytes, pbkdf2Sync } from 'crypto';
import { sign } from 'jsonwebtoken';
import { secret } from '../../config';
import { CurrentUser } from '../../types';

interface SaltHash {
    salt: string;
    hash: string;
}

export function isValidPassword(
    { salt, hash }: SaltHash,
    password: string,
) {
    const compareHash = getHash(password, salt);
    return hash === compareHash;
}

export function getSaltHash(
    password: string,
) {
    const salt = randomBytes(16).toString('hex');
    const hash = getHash(password, salt);
    return { salt, hash };
}

function getHash(
    password: string,
    salt: string,
) {
    return pbkdf2Sync(
        password,
        salt,
        10000,
        512,
        'sha512',
    ).toString('hex');
}

export function getToken(
    user: CurrentUser
) {
    const exp = getTokenExpiry();
    return sign({
        ...user,
        exp,
    }, secret);
}

function getTokenExpiry() {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);
    return exp.getTime() / 1000;
}
