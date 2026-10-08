class Start extends Scene {
    enter() {
        this.engine.setTitle(this.engine.storyData.title);
        this.engine.addNavigationCell("Begin the story");
    }

    handleNavigation() {
        var start = this.engine.storyData.start;
        this.engine.gotoScene(Room, start.x, start.y, {"items": {}, "steps": 0});
    }
}

class Room extends Scene {
    enter(x,y,player)
    {
        this.x = x;
        this.y = y;
        var roomData = this.engine.storyData.rooms[x + "_" + y];
        this.engine.showCaption(roomData.name);
        this.engine.show(roomData.description);
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
            this.engine.show("No items left to collect. Have you already been here?");
        }
        console.log("Inventory:", player.items);

        if (this.engine.storyData.exit.x == x && this.engine.storyData.exit.y == y)
        {
            this.endGame(player);
        }
        else
        {
            this.engine.addInteraction("something", "x", "y");
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
        this.engine.transition();
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
        if (a == "poop") {
            this.engine.show("You pooped");
        }
        if (a == "puppy hair") {
            this.engine.show("The wags its tail, it's happy!");
        }
        if (a == "Wyatt") {
            this.engine.show("The fog is coming");
        }
        if (a == "egg") {
            const result = Math.random() < 0.5 ? "You won" : "You lost";
            this.engine.show(result);
        }
        if (a == "rainwater barrel") {
            this.engine.show("You get in and splash the water around")
        }
    }

    interactions(inventory, roomItems)
    {
        this.engine.addInteraction("Does your house catch rain?", "rainwater barrel")
        this.engine.addInteraction("Pet the puppy", "puppy hair")
        this.engine.addInteraction("Imaginary friend button", "Wyatt")
        this.engine.addInteraction("Eierpecken", "egg")
        this.engine.addInteraction("Go to the restroom", "poop")
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
        let score = Object.keys(player.items).length /player.steps;
        this.engine.show("Your score is: " + score);
        this.engine.show(this.engine.storyData.credits);
    }
}

Engine.load(Start, './myWorld.json');