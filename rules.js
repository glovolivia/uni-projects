class GameWorldItems {
    constructor(name) {
        this.name = name;
    }
}

class Mount extends GameWorldItems {
    constructor(name, isMounted) {
        super(name);
        this.isMounted = isMounted;
        this.nickname = name;
    }

    ride() {
        this.isMounted = true; 
    }

    dismount() {
        this.isMounted = false;
    }
}

class Companion extends GameWorldItems {
    constructor(name, needsGrooming) {
        super(name);
        this.needsGrooming = needsGrooming;
    }

    //Random companion messages display
    //Poppy formatting (I named the dog Poppy):
    //this.engine.show('<span style="color: #3c7807;">' + this.engine.itemString("dog") + " " + "text" + '</span>');
    companionText() {
            var messages = [
                this.name + " is sniffing around",
                this.name + " is judging your ability to solve this puzzle",
                this.name + " wants a cookie",
                this.name + " found something to eat in the corner, you try to see what it was but it's to late",
                this.name + " thinks you are completly lost",
                this.name + " just barked",
                this.name + " wants to cuddle with you",
                this.name + " found a stick!",
                this.name + " is hiding between your legs",
                this.name + " is wagging its tail happily",
                this.name + " is tired",
                this.name + " lies down near the entrance",
                this.name + " sits down and stares you down",
                this.name + " starts howling really loud",
                this.name + " sees something in the distance",
                this.name + " spotted something, but won't tell you what it is",
                this.name + " is rolling in something disgusting, you need to groom them",
                this.name + " is chasing its own tail, cute!",
            ]

            this.randomMessage = messages[Math.floor(Math.random() * messages.length)]

            if (Math.random() < 0.2) {
                this.randomMessage = this.name + " is rolling in something disgusting, you need to groom them";
            }

            this.pet = false;
            if (Math.random() < 0.1) {
                this.pet = true;
            }


            if (this.randomMessage == this.name + " is rolling in something disgusting, you need to groom them" ) {
                this.needsGrooming = true;
                //this.player.bonus -= 1;
            }


            return this.randomMessage;
        }
    }

class Craftables extends GameWorldItems {
    constructor(name, ingredients) {
        super(name);
        this.ingredients = ingredients;
    }

    Craft(inventory) {
        for (var ingredient of this.ingredients) {
            if(!(ingredient in inventory)) {
                return false;
            }
        }
        return true;
    }

    handleItems(inventory) {
        if(!this.Craft(inventory)) {
            return false;
        }
        for (var ingredient of this.ingredients) {
            inventory[ingredient] -= 1;

            if (inventory[ingredient] == 0){
                delete inventory[ingredient];
            }
        }

        if (this.name in inventory) {
            inventory[this.name] += 1;
        } else {
            inventory[this.name] = 1;
        }
        return true;
    }
}

var batteryRecipe = new Craftables("battery", ["zap", "probing_cane"]);
var schnitzel = new Craftables("poultry_leg", ["egg", "bread", "cut_of_meat"]);
var cocktail = new Craftables("tropical_drink", ["lemon", "ice_cube", "bottle_with_popping_cork"]);
var dragonTreat = new Craftables("meat_on_bone", ["cut_of_meat", "hot_pepper"]);
var horseTreat = new Craftables("cookie", ["carrot", "apple"]);

class Start extends Scene {
    enter() {
        this.engine.setTitle(this.engine.storyData.title);
        this.engine.addNavigationCell("Begin the story");
    }

    handleNavigation() {
        var start = this.engine.storyData.start;
        this.engine.gotoScene(Room, start.x, start.y, {
            "items": {},
            "steps": 0,
            "bonus": 0,
            "companion" : null,
            "torch": {
                "battery": 5,
                "isOn": false
            },
            "mount": null,
            "mountNames": {
                "horse": null,
                "dragon_face": null
            }
       })
    }
}

class Room extends Scene {
    enter(x,y,player)
    {
        this.inventory = player.items;
        this.player = player;
        this.torch = this.player.torch;

        this.x = x;
        this.y = y;
        var roomData = this.engine.storyData.rooms[x + "_" + y];
        this.roomItems = roomData.items;
        this.engine.showCaption(roomData.name);
        this.engine.show(roomData.description);
        if(this.player.mount != null && this.player.mount.isMounted) {
            this.engine.show("<i>" + "You are riding " + this.engine.itemString(this.player.mount.name) + " " + this.player.mount.nickname + "<i>") 
            console.log(this.player.mount.name);
        }
        this.torchMechanic(roomData);
        this.lightOn(roomData) 
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

        if(this.player.companion != null) {
            var dog = this.player.companion;
            var random_text = dog.companionText();


            if (dog.needsGrooming) {
                 this.engine.show('<span style="color: #3c7807;">' + this.engine.itemString("nauseated_face") + "  " + this.engine.itemString("dog") + " " + random_text + '</span>');
                 this.player.bonus -= 1;
            } else {
                this.engine.show('<span style="color: #3c7807;">' + this.engine.itemString("dog") + "  " + random_text + '</span>');
            }

            this.pet = dog.pet;
        }

        if(this.roomItems.includes("horse")) {
            this.engine.show("<i>You found a horse!</i>")
        
            if(this.player.mount == null) {
                player.mount = new Mount("horse");
            }
        }

        if(this.roomItems.includes("dragon_face")) {
            this.engine.show("<i>You found a dragon!</i>") 

            if(this.player.mount == null) {
                player.mount = new Mount('dragon_face');
            }
        }

        this.interactions(player.items, roomData.items);

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




    //torch mechanic implementation
    torchMechanic(roomData) {
        if (this.torch.isOn) {
            this.torch.battery -= 1;
            this.engine.show('<i>' + this.torch.battery*20 + "% left" + '<i>');
        }

        if (this.torch.battery == 0) {
            this.torch.isOn = false;
            this.engine.show('<span style="color: #FF0000; font-style: italic;">' + "You run out of battery" + '</span>');
        }
        
    }

    //handles "light" on flashlight on
    lightOn(roomData) {
        if(roomData.bright != null) {
            if (!roomData.bright && !this.torch.isOn) { //false = dark
                document.body.style.backgroundColor = "#080808";
                document.body.style.color = "#121212f3";
                this.engine.show('<span style="color: #ffff; font-style: bold;">' + "You need a flashlight to find an exit" + '</span>');
                this.engine.actionsGridContainer.style.visibility = "hidden";
            } else {
                document.body.style.backgroundColor = "#ffffff";
                document.body.style.color = "#4A4A4A";
                this.engine.actionsGridContainer.style.visibility = "visible";
            }
        }
    }

    //lock mechanism
    handleNavigation(x,y,player) {
        var roomData = this.engine.storyData.rooms[x + "_" + y];
        var key = roomData.requires || [];
        var lock = true;
        var count = 0
        if (key.length > 0) {
            for (var i_tem of key) {
                //debug: console.log(i_tem);
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

        if(roomData.requiresMount != null) {
                if(this.player.mount == null || this.player.mount.name != roomData.requiresMount) {
                    lock = true;
                    this.engine.show('<span style="color: #FF0000; font-style: italic;">' + "You need to be riding a "+ this.engine.itemString(roomData.requiresMount) + " to enter" + '</span>');
                } else {
                    if(!this.player.mount.isMounted) {
                        lock = true;
                        this.engine.show('<span style="color: #FF0000; font-style: italic;">' + "You need to be mounted to enter" + '</span>')
                    }
                }

            }


        if (lock == true) {
            if (roomData.requires.length > 0) {
                this.engine.show('<span style="color: #FF0000; font-style: italic;">' + "You need " + this.engine.itemString(roomData.requires) + " to enter" + '</span>');
            }
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
                this.engine.show("Want to try again?");
            } else {
                this.engine.show("You get a bonus!");
                this.player.bonus += 1750; //further revision to increase the chance of scoring 1856
            }
        
        }

        //Get a dog as a companion - play fetch interaction
        if(a == "dog") {
            this.engine.show("The dog wags its tail with excitement, after a couple minutes you get tired of playing, but the dog won't leave you alone");
            this.engine.show('<i>' + "Gained new companion " + '<i>');
            this.player.bonus += 100;
            
            var dogName = prompt("What will you name your dog?") || "Poppy";
            dogName = dogName[0].toUpperCase() + dogName.slice(1);
            this.player.companion = new Companion(dogName, false);
            this.engine.show('<span style="color: #3c7807; font-style: italic;">' + this.engine.itemString("dog") + "  " + this.player.companion.name + " wags its tail at you, how precious!" + '</span>');
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
                this.engine.show("Now " + this.player.companion.name + " looks great again!")
                this.player.companion.needsGrooming = false;
            } else {
                this.engine.show('<span style="color: #FF0000; font-style: italic;">' + "You can't do this without a comb" + '</span>')

            }
        }

        //Pet your companion
        if (a == "pet") {
            this.engine.show('<span style="color: #3c7807;">' + this.engine.itemString("dog") + "  " + this.player.companion.name + " is happy!" + '</span>');
            this.player.bonus += 5;
        }

        //Flashlight buttons

        if (a == "flashON") {
            var roomData = this.engine.storyData.rooms[this.x + "_" + this.y];
            
            if (this.torch.battery > 0) {
                this.torch.isOn = true;
                this.engine.show('<i>' + "Flashlight is on" + '<i>');
            } else {
                this.torch.isOn = false;
                this.engine.show('<span style="color: #FF0000; font-style: italic;">' + "You run out of battery" + '</span>');
            }

            this.lightOn(roomData);
            this.engine.addInteraction("[Flashlight] Turn Off", "flashOFF");
        }

        if (a == "flashOFF") {
            var roomData = this.engine.storyData.rooms[this.x + "_" + this.y];

            this.torch.isOn = false;
            this.engine.show('<i>' + "Flashlight is off" + '<i>');

            this.engine.addInteraction("[Flashlight] Turn On", "flashON");
            this.lightOn(roomData);
        }

        //battery change (always resores to full power)
        if (a == "battery") {
            this.torch.battery = 5;
            this.engine.show('<i>' + "You have resored your flashlight battery to 100%" + '</i>');
            this.inventory["battery"] -= 1;
            if (this.inventory["battery"] == 0) {
                delete this.inventory["battery"];
            }
            this.engine.addInteraction("[Flashlight] Turn On", "flashON");
        }

        if (a == "dismount") {
            this.player.mount.dismount();
            this.engine.show('<i>' + "You have dismounted" + '<i>')
            this.engine.addInteraction("Mount", "ride")
            this.inventory[this.player.mount.name] = 1;
        }

        if (a == "ride") {
            this.player.mount.ride();
            this.engine.show('<i>' + "You got on your mount" + '<i>')
            this.engine.addInteraction("Dismount", "dismount");
            delete this.inventory[this.player.mount.name];
        }   

        //Recipe interactions

        if(a == "c_horseTreat") {
            if(horseTreat.handleItems(this.inventory)) {
                this.engine.show("<i>You crafted a horse treat!<i>")
            }
        }

        if (a == "c_dragonTreat") {
            if(dragonTreat.handleItems(this.inventory)) {
                this.engine.show("<i>You crafted a dragon treat!<i>")
            }
        }

        if (a == "c_cocktail") {
            if(cocktail.handleItems(this.inventory)) {
                this.engine.show("<i>You crafted a cocktail!<i>")
            }
        }

        if (a == "c_schnitzel") {
            if(schnitzel.handleItems(this.inventory)) {
                this.engine.show("<i>You crafted a schnitzel!<i>")
            }
        }

        if (a == "c_battery") {
            if(batteryRecipe.handleItems(this.inventory)) {
                this.engine.show("<i>You crafted a battery<i>")
            }
        }
        
        //New item interactions - mounts:

        if (a == "hTreat") {
            this.inventory["cookie"] -= 1;
            if(this.inventory["cookie"] == 0) {
                delete this.inventory["cookie"];
            }
            this.engine.show("<i>Your horse is enjoying the treat!<i>");
            this.player.bonus += 20;
        }

        if (a == "dTreat") {
            this.inventory["meat_on_bone"] -= 1;
            if(this.inventory["meat_on_bone"] == 0) {
                delete this.inventory["meat_on_bone"];
            }
            this.engine.show("<i>Your dragon is enjoying the treat!<i>");
            this.player.bonus += 20;
        }
        
        //New items - food
        if (a == "eat_s") {
            this.inventory["poultry_leg"] -= 1;
            if(this.inventory["poultry_leg"] == 0) {
                delete this.inventory["poultry_leg"];
            }
            if (!this.player.companion) {
                this.engine.show("<i>You enjoy your meal alone</i>");
            } else {
                this.engine.show("<i>"+"You share your meal with " + this.player.companion.name + ", they are grateful and very happy!");
            }
        }

        if (a == "drink") {
            this.inventory["tropical_drink"] -= 1;
            if(this.inventory["tropical_drink"] == 0) {
                delete this.inventory["tropical_drink"];
            }
            this.engine.show("<i>You feel so much lighter, how strong is that cocktail exactly?<i>");
            this.engine.show("...")
            this.engine.show(".....")
            this.engine.show("........")
            if(!this.player.companion) {
                this.engine.show("<i>[You passed out in the corner]<i>");
            } else {
                this.engine.show("<i>" + "[You passed out in the corner, you wake up and see that " + this.player.companion.name + "put their little head on your thighs]");
            }
        }

        if (a == "change") {
            
            var currentMount = this.player.mount.name;
            var newMount = currentMount == "horse" ? "dragon_face" : "horse";

            if (newMount in this.inventory) {
                if(this.player.mount.isMounted) {
                    delete this.inventory[newMount];
                    this.inventory[currentMount] = 1;
                }
            }

            this.player.mount.name = newMount;
            this.player.mount.nickname = this.player.mountNames[newMount] || newMount;
            this.engine.show("<i>You changed mounts!</i>");

            this.engine.addInteraction("Change again", "change")
        }

        if(a == "name") {
            var mountName = prompt("What will you name your mount?") || "Bob";
            mountName = mountName[0].toUpperCase() + mountName.slice(1);
            this.player.mountNames[b] = mountName;
            
            if (this.player.mount != null && this.player.mount.name == b) {
                this.player.mount.nickname = mountName;
            }

            console.log(this.player.mount.nickname)
        }
    }



    interactions(inventory, roomItems)
    {
        if (this.roomItems.includes("egg")) {
         this.engine.addInteraction("Eierpecken", "egg");
        }

        if ("boot" in this.inventory && "cyclone" in this.inventory) {
            this.engine.addInteraction("Make a portkey", "portkey")
            this.engine.show('<span style="color: #005F9D; font-style: italic;">' + "You have all the materials to create a portkey" + '</span>');
        }

        if ("trophy" in this.inventory) {
            this.engine.addInteraction("Use the portkey", "teleport");
        }

        if("dog" in this.inventory && "tennis" in this.inventory) {
            this.engine.addInteraction("Play fetch with the dog", "dog");
        }

        if(this.player.companion != null && this.player.companion.needsGrooming) {
            this.engine.addInteraction("Groom " + this.player.companion.name, "groom");
        }

        if (this.pet) {
            this.engine.addInteraction("Pet " + this.player.companion.name, "pet");
        }

        if("flashlight" in this.inventory && !this.player.torch.isOn) {
            this.engine.addInteraction("[Flashlight] Turn On", "flashON");
        }

        if (this.player.torch.isOn) {
            this.engine.addInteraction("[Flashlight] Turn Off", "flashOFF");
        }

        if("battery" in this.inventory) {
            this.engine.addInteraction("[Flashlight] Change the batteries", "battery");
        }

        if(this.player.mount != null) {
            if(this.player.mount.isMounted) {
                this.engine.addInteraction("[Mount] Dismount", "dismount");
            } else {
                this.engine.addInteraction("[Mount] Mount", "ride");
            }
        }

        //Recipe interactions

        if(horseTreat.Craft(this.inventory)) {
            this.engine.addInteraction("Craft [Horse Treat]", "c_horseTreat");
        }

        if(dragonTreat.Craft(this.inventory)) {
            this.engine.addInteraction("Craft [Dragon Treat]", "c_dragonTreat");
        }

        if(cocktail.Craft(this.inventory)) {
            this.engine.addInteraction("Craft [Cocktail]", "c_cocktail");
        }

        if(schnitzel.Craft(this.inventory)) {
            this.engine.addInteraction("Craft [Schnitzel]", "c_schnitzel");
        }

        if(batteryRecipe.Craft(this.inventory)) {
            this.engine.addInteraction("Craft [Battery]", "c_battery");
        }

        //new item uses - mounts 

        if(this.player.mount != null && this.player.mount.name == "horse" && "cookie" in this.inventory) {
            this.engine.addInteraction("Give your horse a treat", "hTreat");
        }

        if(this.player.mount != null && this.player.mount.name == "dragon_face" && "meat_on_bone" in this.inventory) {
            this.engine.addInteraction("Give your dragon a treat", "dTreat"); 
        }
        
        //naming

        if((this.player.mount?.name == "horse" || "horse" in this.inventory) && !this.player.mountNames["horse"]) {
            this.engine.addInteraction("[Mount] Give your horse a name", "name", "horse")
        }

        if((this.player.mount?.name == "dragon_face" || "dragon_face" in this.inventory) && !this.player.mountNames["dragon_face"]) {
            this.engine.addInteraction("[Mount] Give your dragon a name", "name", "dragon_face")
        }

        //new items - food

        if("poultry_leg" in this.inventory) {
            this.engine.addInteraction("Eat the schnitzel", "eat_s");
        }

        if("tropical_drink" in this.inventory) {
            this.engine.addInteraction("Drink your cocktail", "drink");
        }

        //switch mounts

        if(this.player.mount != null && (("horse" in this.inventory && this.player.mount.name == "dragon_face") || ( "dragon_face" in this.inventory && this.player.mount.name == "horse"))) {
            this.engine.addInteraction("[Mount] Change mounts", "change");
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