---
id: requirements
title: Requirements
---

## Functional requirements

### Must criteria

1. A visitor must be able to play the game without registering
2. The system must randomly select players for a new game
3. Players must be able to play videos to the opponents in alternating order
4. The application must be able to recognize which players are laughing in order to award points
5. A player must receive one point for each player he made laugh with his video
6. Players must be able to exchange text messages with each other during a game
7. The system must start the game automatically as soon as 4 players are ready to play.
8. Players must have the possibility to start a game manually, so that rounds with a minimum of 2 and a maximum of 4 players can be played
9. The game has to be finished as soon as each player could show 5 videos (so a game consists of a maximum of 20 videos)
10. Players must be able to choose from predefined video sequences
11. A video sequence may last a maximum of 30 seconds.
12. The system must save the current state of the game so that interrupted games (caused by the user or in case of problems) can be resumed

### Should criteria

1. A user can register on the website in order to persist his score
2. A user can create, edit and delete own video clips from Youtube. 
3. Users can invite other users to the game
4. The system can send and display UTF-8 emojis via chat

## Non-functional requirements

1. Users and visitors must have a working camera and microphone to participate in a game
2. The game must be playable without first installing browser extensions
3. The UI must adapt to the conditions of the end device (responsiveness)
4. It must be possible to play the game without a user manual
5. The game must be playable with the latest version of Google Chrome Browser

## 	Criteria for demarcation

1. The system does not have to be GDPR compatible (data protection)
2. The system does not have to use specially developed deep learning models to detect laughter
3. The system does not have to be able to send binary content (pictures, videos) via chat
