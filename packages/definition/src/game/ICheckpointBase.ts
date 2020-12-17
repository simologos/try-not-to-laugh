import VideoState from "./VideoState";

interface ICheckpointBase {
    
  state: VideoState;
  
  laughed: boolean;
};

export default ICheckpointBase;
