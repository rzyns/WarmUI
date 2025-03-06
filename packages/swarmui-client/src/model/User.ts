import * as z from "zod";

export const UserId = z.string().brand("UserId");
export type UserId = z.output<typeof UserId>;

export const User = z.object({
    id: UserId,
});
export interface User extends z.output<typeof User> {}
