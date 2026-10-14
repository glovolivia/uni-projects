class Start extends Scene {
    enter() {
        this.engine.setTitle(this.engine.storyData.title);
        this.engine.addNavigationCell("Begin the story");
    }

    handleNavigation() {
        var start = this.engine.storyData.start;
        this.engine.gotoScene(Room, start.x, start.y, {"items": {}, "steps": 0, "bonus": 0, "companion" : null, "needsGrooming":false});
    }
}

class Room extends Scene {
    enter(x,y,player)
    {
        this.inventory = player.items;
        this.player = player;

        this.x = x;
        this.y = y;
        var roomData = this.engine.storyData.rooms[x + "_" + y];
        this.engine.showCaption(roomData.name);
        this.engine.show(roomData.description);
        this.companionText();
        this.interactions(player.items, roomData.items);
        player.steps += 1;
        if (roomData.items.length > 0)
        {
            var items = "Items collected: ";
            for(var item of roomData.items)
            {
                items += this.engine.itemString(item) + " ";
                if (player.items[item])
                {
                    player.items[item] += 1;
                }
                else
                {
                    player.items[item] = 1;
                }
            }
            roomData.items = [];
            this.engine.show(items);
        }
        else
        {
            this.engine.show("No items left to collect.");
        }
        console.log("Inventory:", player.items);

        if (this.engine.storyData.exit.x == x && this.engine.storyData.exit.y == y)
        {
            this.endGame(player);
        }
        else
        {
            //this.engine.addInteraction("something", "x", "y");
            // navigation cells come in a 3x3 grid
            // row 1
            this.engine.addTextCell();
            if (this.engine.storyData.rooms[x+"_"+(y-1)])
                this.engine.addNavigationCell("Go North", x, y-1, player);
            else
                this.engine.addTextCell();
            this.engine.addTextCell();

            // row 2
            if (this.engine.storyData.rooms[(x-1)+"_"+y])
                this.engine.addNavigationCell("Go West", x-1, y, player);
            else
                this.engine.addTextCell();
            this.engine.addTextCell("You are here");
            if (this.engine.storyData.rooms[(x+1)+"_"+y])
                this.engine.addNavigationCell("Go East", x+1, y, player);
            else
                this.engine.addTextCell();

            // row 3
            this.engine.addTextCell();
            if (this.engine.storyData.rooms[x+"_"+(y+1)])
                this.engine.addNavigationCell("Go South", x, y+1, player);
            else
                this.engine.addTextCell();
            this.engine.addTextCell();
        }
        var inventory = "Inventory: ";

        for (var item in player.items) {
        inventory += this.engine.itemString(item) + " x" + player.items[item] + " ";
        }
        if(this.engine.storyData.exit.x != x || this.engine.storyData.exit.y != y) {
            this.engine.show(inventory);
        }

        this.engine.transition();
    }

    companionText() {
        if (this.player.companion != null) {
            var messages = [
                this.player.companion + " is sniffing around",
                this.player.companion + " is judging your ability to solve this puzzle",
                this.player.companion + " wants a cookie",
                this.player.companion + " found something to eat in the corner, you try to see what it was but it's to late",
                this.player.companion + " thinks you are completly lost",
                this.player.companion + " just barked",
                this.player.companion + " wants to cuddle with you",
                this.player.companion + " found a stick!",
                this.player.companion + " is hiding between your legs",
                this.player.companion + " is wagging its tail happily",
                this.player.companion + " is tired",
                this.player.companion + " lies down near the entrance",
                this.player.companion + " sits down and stares you down",
                this.player.companion + " starts howling really loud",
                this.player.companion + " sees something in the distance",
                this.player.companion + " spotted something, but won't tell you what it is",
                this.player.companion + " is rolling in something disgusting, you need to groom them",
                this.player.companion + " is chasing its own tail, cute!",
            ]

            this.randomMessage = messages[Math.floor(Math.random() * messages.length)]

            if (Math.random() < 0.15) {
                this.randomMessage = this.player.companion + " is rolling in something disgusting, you need to groom them";
            }


            if (this.randomMessage == this.player.companion + " is rolling in something disgusting, you need to groom them" ) {
                this.player.needsGrooming = true;
            }

            if (this.player.needsGrooming) {
                this.engine.show('<span style="color: #3c7807;">' + this.engine.itemString("nauseated_face") + "  " + this.engine.itemString("dog") + " " + this.randomMessage + '</span>');
            } else {
                this.engine.show('<span style="color: #3c7807;">' + this.engine.itemString("dog") + "  " + this.randomMessage + '</span>');
            }
        }
    }
    handleNavigation(x,y,player) {
        var roomData = this.engine.storyData.rooms[x + "_" + y];
        var key = roomData.requires;
        var lock = true;
        var count = 0
        if (key.length > 0) {
            for (var i_tem of key) {
                console.log(i_tem);
                for (var p_item in player.items) {
                    if (p_item == i_tem) {
                        count += 1;
                    }
                }
                if (count == key.length) {
                    lock = false;
                }
            }
        } else {
            lock = false;
        }
        if (lock == true) {
            this.engine.show("You have no key, you can't enter");
            this.engine.gotoScene(Room, this.x, this.y, player);
        } else {
            this.engine.gotoScene(Room, x, y, player);
        }
    }
    //this.engine.gotoScene(Room, x, y, player);

    handleInteraction(a,b)
    {
        //Eierpecken interaction
        if (a == "egg") {
            const result = Math.random() < 0.5 ? "You won" : "You lost";
            this.engine.show(result);
            if (result == "You lost") {
                this.inventory["hatching_chick"] = 1;
                delete this.inventory["egg"];
            } else {
                this.engine.show("You get a bonus!");
                this.player.bonus += 1750; //further revision to increase the chance of scoring 1856
            }
        
        }

        //Get a dog as a companion - play fetch interaction
        if(a == "dog") {
            this.engine.show("The dog wags its tail with excitement, after a couple minutes you get tired of playing, but the dog won't leave you alone");
            this.engine.show('<i>' + "Gained new companion " + '<i>');
            this.player.bonus += 50;
            
            var dogName = prompt("What will you name your dog?");
            dogName = dogName[0].toUpperCase() + dogName.slice(1);
            this.player.companion = dogName;
            this.engine.show('<span style="color: #3c7807; font-style: italic;">' + this.engine.itemString("dog") + "  " + this.player.companion + " wags its tail at you, how precious!" + '</span>');
            delete this.inventory["dog"];
        }

        //Portkey interaction
        if(a == "portkey") {
            delete this.inventory["boot"];
            delete this.inventory["cyclone"];

            this.inventory["trophy"] = 1;
            //trophy is a portkey

            this.engine.show("You have created a portkey, you can now use it at any point in the game.");
            this.engine.show("")
            this.engine.show("Unfortunetly, you are not a very experienced wizard, so there's no telling when the portkey takes you, will you risk it?");
            this.engine.addInteraction("Use the portkey", "teleport")
        }

        //Portkey teleportation
        if (a == "teleport") {
            delete this.inventory["trophy"];

            //handle teleportation
            var rooms = Object.keys(this.engine.storyData.rooms);
            var randomRoom = rooms[Math.floor(Math.random() * rooms.length)]; //I used AI to explain to me here - rooms is an array of all rooms
            //to handle random existing index I use Math.random() but it gives something [0,1), that's why we multiply by a bigger number
            //here rooms.length (to scale it to the size of the array), then we round down with Math.floor to get an integer
            var cords = randomRoom.split("_");
            this.engine.actionsGridContainer.innerHTML = "";
            this.engine.actionsContainer.innerHTML = "";
            this.engine.gotoScene(Room, Number(cords[0]), Number(cords[1]), this.player);
    
        }

        //Grooming companion 
        if (a == "groom") {
            if ("hair_pick" in this.inventory) {
                this.engine.show("Now " + this.player.companion + " looks great again!")
                this.player.needsGrooming = false;
            } else {
                this.engine.show('<span style="color: #FF0000; font-style: italic;">' + "You can't do this without a comb" + '</span>')

            }
        }


    }

    interactions(inventory, roomItems)
    {
        if (roomItems.includes("egg")) {
         this.engine.addInteraction("Eierpecken", "egg");
        }

        if ("boot" in this.inventory && "cyclone" in this.inventory) {
            this.engine.addInteraction("Make a portkey", "portkey")
            this.engine.show('<span style="color: #005F9D; font-style: italic;">' + "You have all the materials to create a portkey" + '</span>');
        }

        if ("trophy" in this.inventory) {
            this.engine.addInteraction("Use the portkey", "teleport");
        }

        if(roomItems.includes("dog") && "tennis" in this.inventory) {
            this.engine.addInteraction("Play fetch with the dog", "dog");
        }

        if(this.player.needsGrooming) {
            this.engine.addInteraction("Groom " + this.player.companion, "groom");
        }

  

    }

    endGame(player)
    {
        this.engine.show("You have reached the exit! Congratulations!");
        var items = "Items collected:";
        for(var item in player.items)
        {
            items += this.engine.itemString(item) + " x" + player.items[item] + " ";
        }
        this.engine.show(items);
        this.engine.show("Total steps taken: " + player.steps);
        let score = Object.keys(player.items).length + player.steps/2 - 1 + player.bonus;
        this.engine.show("Your score is: " + score);
        this.engine.show(this.engine.storyData.credits);

        if (score == 1859) {
            this.engine.show("Achivement unlocked: ");
            this.engine.show("Pick your battles! Georg Pick approves.");
            // For anyone interested, Georg Pick, born in 1859 developed the Pick's Theorem,
            // that "gives a simple formula for calculating the area of a lattice polygon".
            // An adaptation of this formula is used as a scoring system in my game, easter egg :D
        }
    }
}

Engine.load(Start, './myWorld.json');