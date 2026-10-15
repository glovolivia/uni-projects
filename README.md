# CMPM 120 Project 1 Grid-based World

Student: **Oliwia Glowczynska**
ID: **2157181**
Date: **October 2026**

### Description

This project focues on developing our knowladge of JavaScript and familiarizes us with JSON and data-driven programming. It is a text based game with interactable buttons that allowes the player to explore the secrets of a mysterious castle. 

### Required Mechanics 

- [x] Lock-and-key mechanic 
- [x] Item specific interactions 
- [x] Scoring system

#### Bonus mechanics 

- [x] get lamp mechanic 
- [x] complex puzzles
- [x] complex rooms
- [x] Item system

### Implementation details

- **Lock-and-key mechanic** is implemented in handleNavigation function. It introduces a ***lock*** variable initialized to ***true***, and ***count*** variable initialized to ***0***, then loops over the required items from the JSON file, if all of the items are in the players inventory (count check), the lock variable is set to false, and the player can proceed. Otherwise, it display a message and sets player location back to the room they are currently in. 

- **Eierpecken** is implemented using the Math.random fuction, if the user losses, the egg is deleted from the inventory and is replaced with the ***hatching_chick*** to indicate the loss. 
