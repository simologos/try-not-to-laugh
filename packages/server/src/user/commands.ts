import IUser from "@tntl/definition/src/user/IUser";
import { commandCreator } from "../_definition/commands/commandCreator";
import ICommandCreator from "../_definition/commands/ICommandCreator";

/**
 * Command to add a new user.
 */
export const addUser: ICommandCreator<IUser> =
  commandCreator<IUser>('ADD_USER');