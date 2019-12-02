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
        let petWidth = $petImg.css("width").split("p")[0]
        let petHeight = $petImg.css("height").split("p")[0]
        console.log(petWidth)
        if(this.status === "sleeping" || this.status === "busy") {
            return;
        }
        let count = 0;
        this.status = "busy";
        const eat = setInterval(() => {
            if(count % 2 === 0) {
                $petImg.attr("src", "Images/cat-eating1.png")
            } else {
                $petImg.attr("src", "Images/cat-eating2.png")
            }
            count++;
            if(count === 10) {
                $petImg.attr("src", "Images/cat-idle1.png")
                $emote.css("visibility", "hidden");
                myPet.status = "idle";
                clearInterval(eat);
            }
        }, 100)
        if(this.hunger === 1) {
            console.log("Your pet is full.");
            $petImg.attr("src", "Images/cat-full.png")
            $petImg.css("width", `${(parseInt(petWidth)+1)}px`)
            myPet.status = "idle";
            clearInterval(eat);
        } else {
            $petImg.attr("src", "Images/cat-eating.png")
            $petImg.css("width", `${(parseInt(petWidth)+10)}px`)
            $petImg.css("height", `${(parseInt(petHeight)+10)}px`)
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
        if(this.status === "sleeping" || this.status === "busy") {
            return;
        }
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
            $petImg.attr("src", "Images/catjumping1.png");
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
        if(this.status === "busy") {
            return;
        }
        $petImg.attr("src", "Images/cat-sleeping.png");
        $home.css('background-image', 'url("Images/night.png")');
        this.status = "sleeping";
        const sleepTimer = setInterval(() => {
            if(this.sleepiness === 1) {
                console.log("Your pet is fully rested.");
                this.status = "idle";
                $home.css('background-image', 'url("Images/day.png")');
                $petImg.attr("src", "Images/cat-idle1.png");
                clearInterval(sleepTimer);
            } else {
                this.sleepiness--;
                this.render();
            }
        }, 2000);
    }
    render() {
        $("#hunger").text(`HUNGER: ${myPet.hunger}`);
        $("#boredom").text(`BOREDOM: ${myPet.boredom}`);
        $("#sleepiness").text(`SLEEPINESS: ${myPet.sleepiness}`);
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
            if(count % 4 === 0) {
                myPet.hunger++;
                myPet.render();
            }
            console.log("Zzz...");
        } else {
            if(myPet.hunger >= 10 || myPet.boredom >= 10 || myPet.sleepiness >= 10) {
                setTimeout(() => {
                    $emote.css("top", `${($petImg.position().top-10)}px`)
                    $emote.attr("src", "Images/cat-passed1.png");
                    $emote.css("visibility", "visible");
                }, 500)
                console.log("Your pet died...");
                $("#interface button").off();
                clearInterval(realTimer);
            } else {
                if(count % 4 === 0 && count !== 0) {
                    myPet.hunger++;
                    myPet.boredom++;
                }
                if(count % 10 === 0 && count!== 0) {
                    myPet.sleepiness++;
                }
                if(count % 4 === 0 && myPet.status !== "busy") {
                    $petImg.attr("src", "Images/cat-idle2.png");
                } else if(count % 5 !== 0 && myPet.status !== "busy"){
                    $petImg.attr("src", "Images/cat-idle1.png");
                }
            }
        }
        myPet.render();
        count++;
        console.log(count);
    },1000);
}

$petImg.on("click", () => {
    console.log("tap");
    hatchCount++;
    if(hatchCount === 5) {
        $petImg.attr("src", "Images/egg-cracked1.png")
    }
    if(hatchCount === 10) {
        $petImg.attr("src", "Images/egg-cracked2.png")
    }
    if(hatchCount === 15) {
        myPet.hatch();
        document.getElementById("tap").style.display = "none";
        startLife();
        $petImg.off();
    }
})