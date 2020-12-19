import IIdentifier from "../generic/IIdentifier";
import IUser from "../user/IUser";

interface IExtendedPlayerList {
  users: (IUser & IIdentifier)[];
}

export default IExtendedPlayerList;