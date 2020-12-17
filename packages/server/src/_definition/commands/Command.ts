type Command<T> = {
  type: string;

  payload: T;

  timestamp: number;

  submitterId: string;

  id: string;
};

export { Command as Command };
