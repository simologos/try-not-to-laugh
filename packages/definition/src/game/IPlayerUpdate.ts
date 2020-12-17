import IIdentifier from "../generic/IIdentifier";
import IUser from "../user/IUser";

interface IPlayerUpdate {
  gameId: string;
  user: IUser & IIdentifier;
};

export default IPlayerUpdate;
