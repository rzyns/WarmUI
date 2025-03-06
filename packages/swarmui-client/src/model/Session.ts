import * as z from "zod";
import { UserId } from "./User";

export const SessionId = z.string().brand("SessionId");
export type SessionId = z.output<typeof SessionId>;

export const ServerId = z.string().brand("ServerId");
export type ServerId = z.output<typeof ServerId>;

export const Session = z.object({
    // ["session_id"] = session.ID,
    // ["user_id"] = session.User.UserID,
    // ["output_append_user"] = Program.ServerSettings.Paths.AppendUserNameToOutputPath,
    // ["version"] = Utilities.VaryID,
    // ["server_id"] = Utilities.LoopPreventionID.ToString(),
    // ["permissions"] = JArray.FromObject(session.User.GetPermissions())
    session_id: SessionId,
    user_id: UserId,
    output_append_user: z.boolean(),
    version: z.string(),
    server_id: ServerId,
    permissions: z.array(z.string()),
});

export interface Session extends z.output<typeof Session> {}
