const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

var ground;
var ropes;
var fruta;
var frutalink;
var bgimage, foodimage,bunnyimg, bunny, button;
var blink,eat,sad;
var bgsound,buttonmusic,sadsound,eatsound,airsound;
var btn,btnmute;

let engine;
let world;

function preload(){

  bgimage = loadImage("background.png");
  foodimage = loadImage("melon.png");
  bunnyimg = loadImage("Rabbit-01.png");

  blink = loadAnimation("blink_1.png","blink_2.png","blink_3.png");
  eat = loadAnimation("eat_0.png","eat_1.png","eat_2.png","eat_3.png","eat_4.png");
  sad = loadAnimation("sad_1.png","sad_2.png","sad_3.png");

  bgsound = loadSound("sound1.mp3");
  buttonmusic = loadSound("rope_cut.mp3");
  sadsound = loadSound("sad.wav");
  eatsound = loadSound("eating_sound.mp3");
  airsound = loadSound("air.wav");

  blink.playing = true;
  eat.playing = true;
  sad.playing = true;

  sad.looping = false;
  eat.looping = false;

}

function setup() 
{
  createCanvas(500,700);
  engine = Engine.create();
  world = engine.world;


  button = createImg("cut_btn.png");
  button.position(220,30);
  button.size(50,50);
  button.mouseClicked(drop);

  btn = createImg("balloon.png");
  btn.position(10,210);
  btn.size(150,100);
  btn.mouseClicked(airBaloon);

  btnmute = createImg("mute.png");
  btnmute.position(450,20);
  btnmute.size(50,50);
  btnmute.mouseClicked(mute);

  blink.frameDelay = 15;
  eat.frameDelay = 20;
  sad.frameDelay = 20;

  bunny = createSprite(420,580,100,100);
  bunny.scale =0.2;
  
  bunny.addAnimation("piscando",blink);
  bunny.addAnimation("comendo",eat);
  bunny.addAnimation("triste",sad);
  bunny.changeAnimation("piscando");


  ground = new Ground(200,690,600,20);
  ropes = new Rope(6,{x:245,y:30});

  var frutaop = {
    density:0.001 
  }
  fruta = Bodies.circle(300,300,15,frutaop);
  Matter.Composite.add(ropes.body,fruta);

  frutalink = new Link(ropes,fruta); 
 
  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50);
  imageMode(CENTER);
  
}

function draw() 
{
  background(51);

  
  bgsound.setVolume(0.3);

  image(bgimage,width/2,height/2,500,700);
  Engine.update(engine);
  
  ground.show();
  ropes.show();
  if(fruta !== null){
  image(foodimage,fruta.position.x,fruta.position.y,60,60);
  }

  if(collide(fruta,bunny)== true){
    bunny.changeAnimation("comendo");
    eatsound.play();
  }
  if(fruta !== null && fruta.position.y>= 650){
    bunny.changeAnimation("triste");
    sadsound.play();
    bgsound.stop();
    fruta = null;
  }

  drawSprites();
}


function drop(){
  buttonmusic.play();
  ropes.break();
  frutalink.separar();
  frutalink = null;
}

function collide(body,sprite){
  if(body !== null){
    var d = dist(body.position.x,body.position.y,sprite.position.x,sprite.position.y);
    if(d<80){
      World.remove(world,fruta);
      fruta = null;
      return true;
    }
    else{
      return false;
    }
  }
  
  
}

function airBaloon(){
  Matter.Body.applyForce(fruta,{x:0,y:0},{x:0.01,y:0});
  airsound.play();
}

function mute(){
  if(bgsound.isPlaying()){
    bgsound.stop();
  }
  else{
    bgsound.play();
  }
}


