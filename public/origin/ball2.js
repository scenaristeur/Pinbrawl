function Ball() {
  this.sprite = createSprite(width / 2, height / 4);
  // this.sprite.draw = function () { ellipse(0, 0, 10, 10); }
  this.sprite.addImage(ballImage);
  this.sprite.setCollider("circle", 0, 0, 8);
  this.sprite.maxSpeed = MAX_SPEED;
  this.sprite.friction = 0.02;
  this.sprite.restitution = 0.4;
  // this.sprite.debug = true;

  this.score = 5;
}

Ball.prototype = {
  update() {
    // add gravity
    if (this.sprite.y <= height / 2) {
      this.sprite.addSpeed(GRAVITY, 180);
    }
    else {
      this.sprite.addSpeed(GRAVITY, 0);
    }

    // add score
    if (this.sprite.y > height + 32) {
      leftScore += this.score;
      this.sprite.x = 50;
      this.sprite.y = 200;
      this.sprite.setSpeed(2, 100);
      this.score = 5;
    }
    if (this.sprite.y < -32) {
      rightScore += this.score;
      this.sprite.x = 400;
      this.sprite.y = 600;
      this.sprite.setSpeed(2, 260);
      this.score = 5;
    }
    if (this.score > 999) {
      this.score = 999;
    }
    // console.log("ball", this.sprite)
  },

  reset() {
    this.sprite.x = width / 2;
    this.sprite.y = height / 4;
    this.sprite.setSpeed(0, 0);
    this.score = 5;
  }
}
