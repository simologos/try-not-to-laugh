import ICheckpointBase from "./ICheckpointBase";

interface ICheckpointUpdate extends ICheckpointBase {
  gameId: string,
  checkpointId: string
}

export default ICheckpointUpdate;
