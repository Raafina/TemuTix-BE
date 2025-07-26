import { customAlphabet } from "nanoid"

export const getId = (): string => {
    const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",);

    return nanoid(5); // generate 5 character id
}