# CMPM 120 Project 1 Grid-based World

Student: **Oliwia Glowczynska**\ 
ID: **2157181**\
Date: **October 2026**\


**Play the Game**: [LIVE DEMO](https://glovolivia.github.io/uni-projects/?fbclid=IwY2xjawU9Qg5leHRuA2FlbQIxMABwZG9mBWJyaWQRMVRqcXRPa2dGNGp4aWlZTWhzcnRjBmFwcF9pZBAyMjIwMzkxNzg4MjAwODkyAAEeMuqDgzG3pG0u-RYPkEBKON3N1bhcABkxS9JOMxC9JzAj9K42xawjWBE4V6o_aem_WqaNPmGXnx1n9H2bfe8SDQ)

### Description

This project focuses on developing our knowladge of JavaScript and familiarizes us with JSON and data-driven programming. It is a text based game with interactable buttons that allowes the player to explore the secrets of a mysterious chaotic world. Please keep in mind that "this is a programming class" (~Dr. Marcus Eger), the narrtive of this game is slightly below the standards of industry. However, I hope the mechanics can impress you enough, to enjoy this game, as if the narrative was crafted with far greater respect (that it rightfully deserves).

#### Playtest

**Playtest sample size**: 10 players, ranging from "not familiar with games" to "experienced gamer"\
**Data collection methods**: observation, think-alound, semi-formal interview\
**Average playtime**: 30 minutes\

#### Runnning Instructions

**Play locally**: 
    1. Download and extract project files
    2. Open Terminal and navigate to project directory
    3. Run: python3 -m http.server 8000
    4. Open Open http://localhost:8000 in your browser.

Python3 is needed for a local server. No additional libraries are required.

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

- **Lock-and-key mechanic** is implemented in handleNavigation function. It introduces a ***lock*** variable initialized to ***true***, and ***count*** variable initialized to ***0***, then loops over the required items from the JSON file, if all of the items are in the players inventory (count check), the lock variable is set to false, and the player can proceed. Otherwise, it displays a message and sets player location back to the room they are currently in. 

- **Eierpecken** is implemented using the Math.random fuction, if the user losses, the egg is deleted from the inventory and is replaced with the ***hatching_chick*** to indicate the loss, otherwise player recives a bonus. 

- **Mounts** defined as a subclass, player can name, feed and ride them. Some specific ones moght be required to enter rooms. Mounts can be switched to enter a certain room, not accesible otherwise.

- **Portkey** teleports the player to a random tile on the map

- **Companions** stay with you during your adventure. Player can adopt them, name them and groom them, when they get dirty, by using a comb. 
A companion adds liveliness to the game. Currently implemented one companion: a dog.

- **Flashlight** lights the dark rooms, but uses fuel (batterry) charge, every step you take with it. The player needs to manage resources to
avoid getting stuck in a dark room, (if so happens, the game is lost and they have to start over)

- **Craftables** are objects players can craft using recipes, the implementation of crafting is simple - when required objects are available
in the invenory, a button appears and they can be crafted

- **Scoring** is loosely based on Pick's Theorem, more so on the formula with substituted variables. 
Score = number of items + (number of steps / 2) - 1 + player bonus. Player earns bonus points by interacting wih the game and game objects,
and is not always aware of having earned that bonus. Some states or interaction may carry negative bonus.

- **Complex rooms** implemented using item restrictions, mount requirments, brightness feature and map design. ***this has been thoroughly playtested, and further complications cause frustrution in players***

- **Complex puzzles** contain different properties defined in the JSON file, properties like mount requirments, room brightness, rooms that require specific items in inventory. Some rooms introduce unique interactions.

- **Item System** supports collecting, storing, crafting, consuming and using items. Crafting costs items in turn for creating something new. Certain items can be fed to mounts, act as a key to unlock rooms or allow interaction with game objects.