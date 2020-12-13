var trex, trex_running, trex_collided;

var ground, backgroundImage, invisibleGround;

var cloud, cloudImage, cloudsGroup;

var bird, birdImage1, birdImage2, birdStopImage, bird_stop, birdsGroup;

var obstacle, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6, obstaclesGroup;

var jumpSound, checkPointSound, dieSound;

var gameOver, gameOverImage;

var restart, restartImage;

var PLAY = 1;
var END = 0;
var gameState = PLAY;

var score;

function preload() {

    // animation to trex for different states of game
    trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
    trex_collided = loadImage("trex_collided.png");

    backgroundImage = loadImage("ground2.png");

    cloudImage = loadImage("cloud.png");

    birdImage1 = loadAnimation("bird1.png", "bird2.png");
    birdImage2 = loadAnimation("bird2.png", "bird1.png");
    bird_stop = loadAnimation("bird1.png");
    //bird_stop2 = loadAnimation("bird2.png");

    // different obstacle images to call randomly 
    obstacle1 = loadImage("obstacle1.png");
    obstacle2 = loadImage("obstacle2.png");
    obstacle3 = loadImage("obstacle3.png");
    obstacle4 = loadImage("obstacle4.png");
    obstacle5 = loadImage("obstacle5.png");
    obstacle6 = loadImage("obstacle6.png");

    gameOverImage = loadImage("gameOver.png");

    restartImage = loadImage("restart.png");

    // loading sound files for various events
    jumpSound = loadSound("jump.mp3");

    checkPointSound = loadSound("checkPoint.mp3");

    dieSound = loadSound("die.mp3");
}

function setup() {

    createCanvas(600,200);

    trex = createSprite(50, 150, 10, 10);
    trex.addAnimation("running", trex_running);
    trex.addAnimation("collided", trex_collided);
    trex.scale = 0.5;

    ground = createSprite(300, 165, 600, 5);
    ground.addImage(backgroundImage);
    ground.x = ground.width/2;

    invisibleGround = createSprite(300, 175, 600, 2);
    invisibleGround.visible = false;

    gameOver = createSprite(300, 80, 10, 10);
    gameOver.addImage(gameOverImage);
    gameOver.scale = 0.5;

    restart = createSprite(300, 110, 10, 10);
    restart.addImage(restartImage);
    restart.scale = 0.5;

    cloudsGroup = new Group();

    obstaclesGroup = new Group();

    birdsGroup = new Group();

    score = 0;
}

function draw() {
    background(180);
    
    // displaying score
    text("Score: " + score, 500, 50);

    if(gameState === PLAY) {

        trex.changeAnimation("running", trex_running);

        gameOver.visible = false;
        restart.visible = false;

        ground.velocityX = -(5 + score/60);

        if(score > 0 && score%100 === 0) {
            checkPointSound.play();
        }

        // resetting ground to make it look infinite
        if(ground.x < 0) {
            ground.x = ground.width/2;
        }

        // calculating score
        score = score + Math.round(random(getFrameRate()/30));

        // jumping trex
        if(keyDown("space") && trex.collide(invisibleGround)) {
            trex.velocityY = -13;
            jumpSound.play();
        }

        // adding gravity effect
        trex.velocityY = trex.velocityY + 0.8;

        spawnClouds();

        spawnObstacles();

        flyingBirds();

        if(obstaclesGroup.isTouching(trex)) {
            gameState = END;
            
            dieSound.play();
        }
    }
    else if(gameState === END) {

        gameOver.visible = true;
        restart.visible = true;

        // stop ground when game ends
        ground.velocityX = 0;

        trex.y = 150;

        //changing trex animation on collision  
        trex.changeAnimation("collided", trex_collided);

        // stop trex from jumping when game ends
        trex.velocityY = 0;

        obstaclesGroup.setVelocityXEach(0);
        cloudsGroup.setVelocityXEach(0);
        birdsGroup.setVelocityXEach(0);

        // stop cloud and obstacle from disappearing
        obstaclesGroup.setLifetimeEach(-1);
        cloudsGroup.setLifetimeEach(-1);
        birdsGroup.setLifetimeEach(-1);

        //birds stop on collision
        //bird.changeAnimation("stop", bird_stop);
        //birdsGroup.setAnimationEach("stop", bird_stop);

        if(mousePressedOver(restart)) {
            reset();
        }
    }

    // stop trex from falling and to make it appear on the ground
    trex.collide(invisibleGround);

    drawSprites();
}

function spawnClouds() {
    if(frameCount % 80 === 0) {
        cloud = createSprite(600, 30, 10, 10);
        cloud.addImage(cloudImage);
        cloud.scale = 0.5;
        cloud.velocityX = -3;

        // generating clouds at different heights
        cloud.y = Math.round(random(30,80));

        // make the clouds appear in background of trex
        cloud.depth = trex.depth;
        trex.depth = trex.depth + 1;

        // destroy cloud objects to prevent memory leak
        cloud.lifeTime = 300;

        cloudsGroup.add(cloud);
    }
}

function spawnObstacles() {
    if(frameCount % 80 === 0) {
        obstacle = createSprite(600, 160, 10, 10);
        obstacle.scale = 0.4;
        obstacle.velocityX = -(5 + score/60);

        // set different animations for obstacle randomly
        var r_num = Math.round(random(1,6));

        switch(r_num) {
            case 1: obstacle.addImage(obstacle1);
                    break;
            case 2: obstacle.addImage(obstacle2);
                    break;
            case 3: obstacle.addImage(obstacle3);
                    break;
            case 4: obstacle.addImage(obstacle4);
                    break;
            case 5: obstacle.addImage(obstacle5);
                    break;
            case 6: obstacle.addImage(obstacle6);
                    break;
            default: break;
        }

        // destroy obstacle objects to prevent memory leak
        obstacle.lifeTime = 200;

        obstaclesGroup.add(obstacle);
    }
}

function flyingBirds() {
    if(frameCount % 65 === 0) {
        bird = createSprite(600, 50, 10, 10);
        bird.velocityX = -4;
        bird.scale = 0.2;

        // random animation to bird
        var num = Math.round(random(1,2));

        switch(num) {
            case 1: bird.addAnimation("flying_bird1", birdImage1);
                    break;
            case 2: bird.addAnimation("flying_bird2", birdImage2);
                    break;
            default: break;
        }
        
        // bringing in birds at different heights
        bird.y = Math.round(random(25,70));

        // make the birds appear in background of trex
        bird.depth = trex.depth;
        trex.depth = trex.depth + 1;

        //destroy bird objects that are not in use to prevent memory leak
        bird.lifeTime = 150;

        birdsGroup.add(bird);
    }
}

function reset() {
    gameState = PLAY;

    // remove the existing cloud, bird and obstacle objects from screen as game restarts
    obstaclesGroup.destroyEach();
    cloudsGroup.destroyEach();
    birdsGroup.destroyEach();

    // reset score
    score = 0;
}