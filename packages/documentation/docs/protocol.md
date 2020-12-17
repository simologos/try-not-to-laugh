---
id: protocol
title: Network protocol
---

All game communication is based on a text-based protocol. JSON is chosen as the format. All actions are sent to the server as JSON string. Actions describe what happens during the game and can be triggered by the client or the server. The server receives the actions and executes further actions depending on the business logic. This way a generic protocol can be created function independent (game logic, chat messages etc.). Depending on the action, the server may persist data (checkpointing).  

Actions sent or forwarded by the server are received on the client via WebSocket.

The exact elaboration of the protocol is still pending. Generic fields are:
- action ```string```: Unique name of the action
- timestamp ```number```: Time at which the action was triggered
- payload ```any```: Action-specific data package

Example:

```
{
  action: "PlayVideo"
  timestamp: 1599420913384
  payload: {
    url: "https://youtube.com/xxx
  }
}
```

[Socket.io Namespaces](https://socket.io/docs/namespaces/) are used to split the logic over a single shared connection.

## Namespace /library
This namespace is only available to authenticated users and is used to manage the custom videos provided by registered users.

### List all videos

#### Request

```
{
  action: "list"
  timestamp: 1599420913384
  payload: {
    search: 'funny'
    start: 0
    limit: 10	
  }
}
```

#### Response
```
{
  action: "list"
  timestamp: 1599420913384
  payload: {
    result: [
      { 
        id: '123'
        name: 'A funny video'
        url: 'https://youtube.com/123'
      },
      …
    ]
    count: 45
    start: 0
    limit: 10	
  }
}

```