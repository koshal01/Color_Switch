//game object that holds background and graphic context
var game = {
    draw: game_stage.getContext('2d'),
    h: 600,
    w: 400,
    bg_color: "#000000",
    xpos: 0,
    ypos: 0,
    start: false,
    gameover: false
};
//declare player object and initialize the play position x axis position and y axis height with color
var player = {
    xpos: 200 - 7,
    ypos: 550,
    h: 14,
    w: 14,
    color: "",
    rot: 0
};
//we create a world object all obstacle y axis will depend in word ypos;
var world = {
    xpos: 210,
    ypos: 550,
    rotx: 0,
    roty: 90
};
var score = 0;
var coords = {
        x_axis: function(x) {
            return (x * Math.cos(world.rotx * (Math.PI / 180)) + world.xpos);
        },
        y_axis: function get_y(y) {
            return (y * Math.sin(world.roty * (Math.PI / 180)) + world.ypos);
        }
    }
    //this array will hold all obstacle
var _obs = [];

//this collection of colors that we will get the value random
var colorz = ['orange', 'deepskyblue', 'lime'];
//initialize player color
player.color = colorz[Math.floor(Math.random() * colorz.length)];

var gravity = 0;
var forceup = 0;

//audio files
var fly = new Audio();
var scor = new Audio();
var ded = new Audio();

fly.src = "fly.wav";
scor.src = "score.wav";
ded.src = "dead.wav";

function main_() {
    //the main will not create a looping effect unless we click a keyboard once and the gamestart is equal to true
    if (game.start == true) {
        window.requestAnimationFrame(main_);
    }
    game.draw.fillStyle = game.bg_color;
    game.draw.fillRect(game.xpos, game.ypos, game.w, game.h);

    if (game.gameover == false) {
        player_();
    }
    obs_();
    if (coords.y_axis(_obs[_obs.length - 1].next * -1) >= 0) {
        create_obs_();
    }
    game.draw.font = "15px tahoma";
    game.draw.fillStyle = "white";
    game.draw.fillText("Score: " + score, 20, 40);
}
//player function
function player_() {
    //we rotate the player to one then if the rotaion is greater than 360 the player rotation will be 0 again
    player.rot += 1;
    if (player.rot >= 360) {
        player.rot = 0;
    }

    game.draw.save();
    game.draw.translate(player.xpos + 7, player.ypos + 7);
    game.draw.rotate(player.rot * (Math.PI / 180));
    game.draw.fillStyle = player.color;
    game.draw.fillRect(-7, -7, player.w, player.h);
    game.draw.restore();

    if (player.ypos > 400) {
        player.ypos += forceup - gravity;
    } else {
        if (forceup - gravity < 0) {
            world.ypos -= forceup - gravity;
        } else {
            player.ypos += forceup - gravity;
        }
    }

    gravity -= 0.19;
    if (player.ypos + player.w >= game.h && game.gameover == false) {
        player_is_dead_();
        game.gameover = true;
    }
}
//function call where the player hit in obstacle that is not equal the color of obstacle
function player_is_dead_() {
    ded.play();
    var modal = document.getElementById("myModal");
    var span = document.getElementsByClassName("close")[0];
    document.getElementById("score").innerHTML = score;

    localStorage.setItem("score", score);
    var highscore = localStorage.getItem("highscore");

    if (highscore !== null) {
        if (score > highscore) {
            localStorage.setItem("highscore", score);
        }
    } else {
        localStorage.setItem("highscore", score);
    }

    modal.style.display = "block";

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            location.reload();
        }
    }

    window.addEventListener("keypress", go);

    function go() {
        location.reload();
    }
}

function obs_() {
    //we loop it if ther i did not meet the condition and we draw the obstacles
    for (var i = 0; i < _obs.length; i++) {
        _obs[i].draw(i);
    }
    for (var i = 0; i < _obs.length; i++) {
        _obs[i].check(i);
    }
}
_obs.push(new obs1());
_obs[_obs.length - 1].init(colorz[Math.floor(Math.random() * colorz.length)], 0, 150);

var create_obs = true;

function create_obs_() {
    if (create_obs == true) {
        var rand = Math.floor(Math.random() * 2);
        if (rand == 0) {
            _obs.push(new obs1());
            _obs[_obs.length - 1].init(colorz[Math.floor(Math.random() * colorz.length)], 0, _obs[_obs.length - 2].next + 70);
        } else if (rand == 1) {
            _obs.push(new obs2());
            _obs[_obs.length - 1].init(colorz[Math.floor(Math.random() * colorz.length)], 0, _obs[_obs.length - 2].next + 50);
        }
    }
}
create_obs_();
create_obs_();

bod.onkeypress = function(e) {
    if (e.keyCode == 32) {
        game.gameover ? fly.pause() : fly.play();

        if (game.start == false) {
            game.start = true;
            main_();
        }
        //every time we press a key the gravity will be zero and force up will be -2.4 to make out player jump 
        gravity = 0;
        forceup = -3.5;
    }
}
window.onload = () => {
    main_();
}

//this is a single circle obstacle
function obs1() {
    this.xpos = 0;
    this.ypos = 0;
    this.x_axis;
    this.y_axis;
    this.rot = 0;
    this.rotsped = 0.05;
    this.next = 0;
    this.switched = false;
    this.rott = 0;
    this.init = function(color, x_ax, y_ax) {
        //axis is the distance in world point
        this.x_axis = x_ax;
        this.y_axis = y_ax * -1;
        // console.log(y_ax);
        this.color = color;
        this.xpos = 200 - 5;
        this.next = y_ax + 180;
    }
    this.draw = function() {
        //360 is angle of circle then we divide to 30 to make a 30 squares
        var rad = 360 / 30;
        var rot = 0;
        var color = "";
        for (var i = 0; i < 30; i++) {
            var xx = 80 * Math.cos(this.rot * (Math.PI / 180)) + this.xpos;
            var yy = 80 * Math.sin(this.rot * (Math.PI / 180)) + coords.y_axis(this.y_axis);

            if (i < 10) {
                color = "lime";
            } else if (i >= 10 && i < 20) {
                color = "orange";
            } else {
                color = "deepskyblue";
            }
            //then we check the coordinates of player and squares rotation in the circle if meet this condition
            if (xx <= player.xpos && xx + 10 >= player.xpos && yy <= player.ypos && yy + 10 >= player.ypos) {
                if (player.color != color && game.gameover == false) {
                    game.gameover = true;
                    player_is_dead_();
                }
            }
            //here we check the lower square if it collide to obstacle
            if (xx <= player.xpos + player.h && xx + 10 >= player.xpos + player.h && yy <= player.ypos + player.h && yy + 10 >= player.ypos + player.h) {
                if (player.color != color && game.gameover == false) {
                    game.gameover = true;
                    player_is_dead_();
                }
            }
            //draw the circles in circle
            game.draw.beginPath();
            game.draw.arc(xx, yy, 7, 0, 2 * Math.PI);
            game.draw.fillStyle = color;
            game.draw.fill();
            game.draw.stroke();
            game.draw.closePath();
            this.rot += rad + this.rotsped;

        }

        if (this.switched == false) {
            game.draw.save();
            game.draw.translate(player.xpos + 10.5, coords.y_axis(this.y_axis) + 10.5);
            game.draw.fillStyle = "#999999";
            game.draw.fillRect(-10.5, -10.5, 14, 14);
            game.draw.restore();
            if (coords.y_axis(this.y_axis) + 7 >= player.ypos) {
                this.switched = true;
                score++;
                scor.play();
                player.color = colorz[Math.floor(Math.random() * colorz.length)];
            }
        }
    }
    this.check = function(i) {
        if (coords.y_axis(this.y_axis) - 90 > game.h) {
            _obs.splice(i, 1);

        }
    }
}

//double circle
function obs2() {
    this.xpos = 0;
    this.ypos = 0;
    this.x_axis;
    this.y_axis;
    this.rot = 0;
    this.w = 3;
    this.h = 2;
    this.rotsped = 0.01;
    this.next = 0;
    this.switched = false;
    this.rott = 0;
    this.init = function(color, x_ax, y_ax) {
        //axis is the distance in world point
        this.x_axis = x_ax;
        this.y_axis = y_ax * -1;
        this.color = color;
        this.xpos = 192 - 35;
        this.next = y_ax + 160;
    }
    this.draw = function() {
        var rad = 360 / 150;
        var color = 0;
        this.ypos = coords.y_axis(this.y_axis);
        for (var i = 0; i < 150; i++) {
            if (i < 50) {
                color = "lime";
            } else if (i >= 50 && i < 100) {
                color = "orange";
            } else {
                color = "deepskyblue";
            }
            var xx = 40 * Math.cos(this.rot * (Math.PI / 180)) + this.xpos;
            var yy = 40 * Math.sin(this.rot * (Math.PI / 180)) + this.ypos;
            var rot = Math.atan2(yy - this.ypos, xx - this.xpos);
            game.draw.save();
            game.draw.translate(xx + this.w, yy);
            game.draw.rotate(rot);
            game.draw.fillStyle = color;
            game.draw.fillRect(this.w * -1, 0, this.w, this.h);
            game.draw.restore();
            var tx = (player.xpos + (player.w / 2)) - xx + 1.5;
            var ty = (player.ypos + (player.h / 2)) - yy;
            var d = Math.sqrt(tx * tx + ty * ty);
            if (d <= 10) {
                if (player.color != color && game.gameover == false) {
                    game.gameover = true;
                    player_is_dead_();
                }
            }

            var xx = 40 * Math.cos((180 - this.rot) * (Math.PI / 180)) + this.xpos + 83;
            var yy = 40 * Math.sin((180 - this.rot) * (Math.PI / 180)) + this.ypos;
            var rot = Math.atan2(yy - this.ypos, xx - this.xpos);
            game.draw.save();
            game.draw.translate(xx + this.w, yy);
            game.draw.rotate(rot);
            game.draw.fillStyle = color;
            game.draw.fillRect(this.w * -1, 0, this.w, this.h);
            game.draw.restore();
            this.rot += rad + this.rotsped;

        }
        if (this.switched == false) {
            game.draw.save();
            game.draw.translate(player.xpos + 7, coords.y_axis(this.y_axis - 80) + 7);
            game.draw.fillStyle = "#999999";
            game.draw.fillRect(-7, -7, 14, 14);
            game.draw.restore();
            if (coords.y_axis(this.y_axis - 80) + 7 >= player.ypos) {
                this.switched = true;
                score++;
                scor.play();
                player.color = colorz[Math.floor(Math.random() * colorz.length)];
            }
        }
    }
    this.check = function(i) {
        if (this.ypos - 50 > game.h) {
            _obs.splice(i, 1);
        }
    }
}