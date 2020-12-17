import IChatMessageBase from "./IChatMessageBase";

interface IChatMessage extends IChatMessageBase {

  sender: string;

  createdAt: number;
}

export default IChatMessage;
