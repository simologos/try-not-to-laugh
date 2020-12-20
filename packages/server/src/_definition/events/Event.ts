type Event<T> = {
  type: string;

  payload: T;

  submitterId: string;

  timestamp: number;

  duration: number;

  recipients: string[];

  id: string;
};

export { Event };
