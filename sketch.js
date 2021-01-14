var monkey,monkeyAnimation,monkeycollidedAnimation;
var banana,bananaImage,bananaGroup;
var ground;
var obstacle,obstacleImage,obstacleGroup;
var background1,backgroundImage;
var restart,restartImage,gameOver,gameOverImage;

var score=0;

var PLAY=1;
var END=0;
var gameState=PLAY;

localStorage["highscore"]=0;

function preload(){
  monkeyAnimation = loadAnimation("Monkey_01.png","Monkey_02.png","Monkey_03.png","Monkey_04.png","Monkey_05.png","Monkey_06.png","Monkey_07.png","Monkey_08.png","Monkey_09.png","Monkey_10.png");
  
  monkeycollidedAnimation = loadImage("Monkey_05.png");

  bananaImage = loadImage("Banana.png");
  
  obstacleImage = loadImage("stone.png");
  
  backgroundImage = loadImage("jungle.jpg");
  
  restartImage = loadImage("restart.png");
  gameOverImage = loadImage("gameOver.png");
}

function setup() {
  createCanvas(500,300);
  
  background1 = createSprite(250,150);
  background1.addImage("back",backgroundImage);
  background1.scale=0.52;
  
  monkey = createSprite(90,230);
  monkey.addAnimation("monkeyimage",monkeyAnimation);
  monkey.addAnimation("monkeycollidedAnimation",monkeycollidedAnimation);
  monkey.scale=0.1;
  
  ground = createSprite(250,280,500,45);
  ground.visible=false;
  
  gameOver = createSprite(250,100);
  gameOver.addImage("goimage",gameOverImage);
  gameOver.visible=false;
  
  restart = createSprite(250,150);
  restart.addImage("restartimage",restartImage);
  restart.visible=false;
  restart.scale=0.5;
  
  bananaGroup = new Group();
  obstacleGroup = new Group();
}


function draw(){
  background(255);
  
  if(gameState===PLAY) {
    if(keyDown("space") && monkey.y>196) {
      monkey.velocityY=-11;
    }
    
    monkey.velocityY=monkey.velocityY+0.5;
    
    spawnBananas();
    spawnObstacle();
    
    if(bananaGroup.isTouching(monkey)) {
      bananaGroup.destroyEach();
      score=score+2;
    }
    
   switch(score) {
     case 10 : monkey.scale=0.12;
       break;
     case 20 : monkey.scale=0.14;
       break;
     case 30 : monkey.scale=0.16;
       break;
     case 40 : monkey.scale=0.18;
       break;
     case 50 : monkey.scale=0.2;
       break;
     default : break;
   }
    
    if(obstacleGroup.isTouching(monkey)) {
      gameState=END;
    }
  }
  
  else if(gameState===END) {
    gameOver.visible=true;
    restart.visible=true;
    
    bananaGroup.setVelocityXEach(0);
    obstacleGroup.setVelocityXEach(0);
  
    bananaGroup.setLifetimeEach(-1);
    obstacleGroup.setLifetimeEach(-1);
    monkey.changeAnimation("monkeycollidedAnimation",monkeycollidedAnimation);
    
    monkey.velocityY=0;
    
    if(mousePressedOver(restart)) {
      restartFunction();
    }
  }
  
  monkey.collide(ground);
  
  drawSprites();
  
  stroke("white");
  textSize(20);
  fill("white");
  
  text("Score: "+score,400,50);
  
  if(localStorage["highscore"]>0) {
    text("High Score: "+localStorage["highscore"],353,70);
  }
}

function spawnBananas() {
  if(frameCount%90===0) {
    banana = createSprite(530,150);
    banana.addImage("bananaimage",bananaImage);
    banana.scale=0.055;
    
    banana.velocityX=-(6+(score/20));
    banana.setCollider("rectangle",0,0,banana.width,banana.height/2,0);
    
    banana.y = Math.round(random(100,180));
    
    banana.lifetime=100;
    
    bananaGroup.add(banana);
  }
}

function spawnObstacle() {
  if(frameCount%200===0) {
    obstacle = createSprite(530,230);
    obstacle.addImage("obsimage",obstacleImage);
    obstacle.scale=0.2;
    
    obstacle.setCollider("rectangle",0,0,obstacle.width-40,obstacle.height-130,0);
    
    obstacle.velocityX=-(6+(score/30));
    
    obstacle.lifetime=115;
    
    obstacleGroup.add(obstacle);
  }
}

function restartFunction() {
  gameState=PLAY;
  
  monkey.changeAnimation("monkeyimage",monkeyAnimation);
  
  bananaGroup.destroyEach();
  obstacleGroup.destroyEach();
  
  gameOver.visible=false;
  restart.visible=false;
  
  if(localStorage["highscore"]<score) {
    localStorage["highscore"]=score;
  }
  
  score=0;
  
  monkey.scale=0.1;
}