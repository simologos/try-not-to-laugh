import IIdentifier from "@tntl/definition/src/generic/IIdentifier";
import { publishEvent } from "../../eventPublisher";
import { getErrorEvent, getEventFromCommand } from "../../_helpers/eventGenerator";
import { Command } from "../../_definition/commands/Command";
import { subscribe } from "../../commandPublisher"
import { removeVideo } from "../commands";
import { onVideoDeleted } from "../events";
import { libraryModel } from "../repository/model";

const processCommand = async (command: Command<IIdentifier>) => {
  
  try{
    const result = await libraryModel.findByIdAndRemove(command.payload.id).exec();

    if(!result) {
      publishEvent(getErrorEvent('Could not delete', command));
    
      return;
    }

    publishEvent(getEventFromCommand(onVideoDeleted, command, {
      id: command.payload.id
    }));

  } catch(e){
    publishEvent(getErrorEvent(e.message, command));
  }
};

export const registerRemoveVideoHandler = () => {
  subscribe(removeVideo.type, processCommand);
}