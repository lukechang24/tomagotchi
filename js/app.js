class Tomagotchi {
    constructor(name, age) {
        this.name = name;
        this.hunger = 1;
        this.boredom = 1;
        this.sleepiness = 1;
        this.age = age;
        this.playCount = 0;
        this.feedCount = 0;
        this.status = "idle";
    }
    hatch() {
        $petImg.attr("src", "Images/cat-idle1.png");
        $("#play").on("click", () => {
            myPet.play();
        });
        
        $("#turn-off-light").on("click", () => {
            myPet.sleep();
        })
        
        $("#feed").on("click", () => {
            myPet.feed();
        })
    }
    feed() {
        let count = 0;
        $("#emote").attr("src", "Images/heart.png");
        this.status = "busy";
        const moveHeart = setInterval(() => {
            if(count % 2 === 0) {
                $emote.animate({left: "5px"},10)
            } else {
                $emote.animate({left: "5px"},10)
            }
            count++;
            if(count === 10) {
                $petImg.attr("src", "Images/cat-idle1.png")
                $emote.css("visibility", "hidden");
                myPet.status = "idle";
                clearInterval(moveHeart);
            }
        }, 100)
        if(this.hunger === 1) {
            console.log("Your pet is full.");
            myPet.status = "idle";
            clearInterval(moveHeart);
        } else {
            $petImg.attr("src", "Images/cat-eating.png")
            $emote.css("visibility", "visible");
            this.feedCount++;
            if(this.feedCount === 3) {
                this.sleepiness++;
                this.feedCount = 0;
            }
            this.hunger--;
            this.render();
        }
    }
    play() {
        let count = 0;
        this.status = "busy";
        const shakePet = setInterval(() => {
            if(count % 2 === 0) {
                $petImg.animate({bottom: "30px"}, 100);
            } else {
                $petImg.animate({bottom: "0px"}, 100);
            }
            count++;
            if(count === 10) {
                $petImg.attr("src", "Images/cat-idle1.png");
                myPet.status = "idle";
                clearInterval(shakePet);
            }
        }, 100);
        if(this.boredom === 1) {
            console.log("Your pet is not bored anymore. Stop playing with it.");
            myPet.status = "idle";
            clearInterval(shakePet);
        } else {
            $petImg.attr("src", "Images/catjumping.png");
            this.playCount++;
            if(this.playCount === 3) {
                this.hunger++;
                this.sleepiness++;
                this.playCount = 0;
            }
            this.boredom--;
            this.render();
        }
    }
    sleep() {
        $petImg.attr("src", "Images/cat-sleeping.png");
        $home.css("background-color", "rgb(47, 47, 47)");
        this.status = "sleeping";
        const sleepTimer = setInterval(() => {
            if(this.sleepiness === 1) {
                console.log("Your pet is fully rested.");
                this.status = "idle";
                $home.css("background-color", "rgb(216, 216, 216)");
                $petImg.attr("src", "Images/cat-idle1.png");
                clearInterval(sleepTimer);
            } else {
                this.sleepiness--;
                this.render();
            }
        }, 2000);
    }
    render() {
        $("#hunger").text(`Hunger: ${myPet.hunger}`);
        $("#boredom").text(`Boredom: ${myPet.boredom}`);
        $("#sleepiness").text(`Sleepiness: ${myPet.sleepiness}`);
    }
}
let myPet = new Tomagotchi("lukas", 1, 1, 1, 1);
console.log(myPet)

let $light = $("#turn-off-light");
let $petImg = $("#pet");
let $home = $("#home");
let $emote= $("#emote");
let count = 0;
let hatchCount = 0;

myPet.render();
function startLife() {
    const realTimer = setInterval(() => {
        if(myPet.status === "sleeping") {
            console.log("Zzz...");
        } else {
            if(myPet.hunger >= 10 || myPet.boredom >= 10 || myPet.sleepiness >= 10) {
                console.log("Your pet died...");
                myPet.status = "dead";
                $("#interface button").off();
                clearInterval(realTimer);
            }
            if(count % 5 === 0 && count !== 0) {
                myPet.hunger++;
                myPet.boredom++;
                myPet.render();
            }
            if(count % 5 === 0 && myPet.status !== "busy") {
                $petImg.attr("src", "Images/cat-idle2.png");
            } else if(count % 5 !== 0 && myPet.status !== "busy"){
                $petImg.attr("src", "Images/cat-idle1.png");
            }
        }
        count++;
        console.log(count);
    },1000);
}

$petImg.on("click", () => {
    hatchCount++;
    if(hatchCount === 5) {
        $petImg.attr("src", "Images/egg-cracked1.png")
    }
    if(hatchCount === 10) {
        $petImg.attr("src", "Images/egg-cracked2.png")
    }
    if(hatchCount === 15) {
        myPet.hatch();
        startLife();
        $petImg.off();
    }
})