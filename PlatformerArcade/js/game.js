const config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 1200,
  heigth: 900,
  scene: {
    preload,
    create,
    update,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 300
      },
      debug: false,
    },
  }
};

const game = new Phaser.Game(config);

var player;
var platforms;
var cursors;
var score = 0;
let scoreText;
let text;
let timer;
let time = 100;

function preload() {
  // Загрузка фоновой картинки
  this.load.image('sky', './img/sky.png');
  // Загрузка платформы
  this.load.image('ground', './img/platform.png');
  // Звезды
  this.load.image('star', './img/star.png');
  // Бомбы
  this.load.image('bomb', './img/bomb.png');
  // Игровой персонаж
  this.load.spritesheet('dude', './img/dude.png', {
    frameWidth: 32,
    frameHeight: 48
  });
}

function create() {
  // Задаем фон
  this.add.image(600, 320, 'sky').setScale(1.5);

  // Создаем статическую группу
  platforms = this.physics.add.staticGroup();
  platforms.create(200, 760, 'ground').refreshBody();
  platforms.create(600, 770, 'ground').refreshBody();
  platforms.create(1000, 760, 'ground').refreshBody();
  platforms.create(400, 600, 'ground').setScale(0.6).refreshBody();
  platforms.create(700, 650, 'ground').setScale(0.4).refreshBody();
  platforms.create(200, 300, 'ground').setScale(0.8).refreshBody();
  platforms.create(550, 390, 'ground').setScale(0.4).refreshBody();
  platforms.create(950, 500, 'ground').setScale(0.6).refreshBody();
  platforms.create(1000, 240, 'ground').setScale(0.7).refreshBody();

  // Добавляем игрока
  player = this.physics.add.sprite(100, 450, 'dude').setBounce(0.2).setCollideWorldBounds(true);

  // Анимация движения влево
  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', {
      start: 0,
      end: 3
    }),
    frameRate: 10,
    repeat: -1
  });

  // Анимация поворота
  this.anims.create({
    key: 'turn',
    frames: [{
      key: 'dude',
      frame: 4
    }],
    frameRate: 20
  });

  // Анимация движения вправо
  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', {
      start: 5,
      end: 8
    }),
    frameRate: 10,
    repeat: -1
  });

  // Курсор для управления
  cursors = this.input.keyboard.createCursorKeys();

  // Создаем звезды
  let stars = [];
  for (let i = 0; i < 1; i++) {
    let star = this.physics.add.sprite(25 + 60 * i, 0, 'star');
    star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    stars.push(star);
  }

  // Определяем взаимодействие между игроком и платформой
  this.physics.add.collider(player, platforms);
  // Между звездами и платформой
  this.physics.add.collider(stars, platforms);

  // Здесь должен быть ваш код...
  this.physics.add.collider(stars, player, destroyStars, null, this);
  timer = this.add.text(10, 50, 'Time: ' + time, { fontSize: 24, fontFamily: 'cursive' });
  scoreText = this.add.text(10, 10, 'Your score: ' + score, { fontSize: 24, fontFamily: 'cursive' });
}

function destroyStars(stars) {
  stars.destroy();
  score += 10;
  scoreText.setText('Your Score:' + score, { fontSize: 24, fontFamily: 'cursive' });
}

function update() {
  if (cursors.left.isDown) {
    // Движение влево
    player.setVelocityX(-160);
    player.anims.play('left', true);
  } else if (cursors.right.isDown) {
    // Движение вправо
    player.setVelocityX(160);
    player.anims.play('right', true);
  } else {
    // Стоит
    player.setVelocityX(0);
    player.anims.play('turn');
  }
  // Прыжок
  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-330);
  }
  if (score == 10 && time > 0) {
    this.physics.pause();
    this.add.text(460, 200, 'You Won', { fontSize: 60, fontFamily: 'cursive' });
    this.add.text(410, 400, 'Click to Restart', { fontSize: 45, fontFamily: 'cursive' });
    this.input.on('pointerup', () => {
      score = 0;
      time = 900;
      this.scene.restart();
    });
  } else if (time <= 0 && score != 10) {
    this.physics.pause();
    this.add.text(450, 200, 'Game Over', { fontSize: 60, fontFamily: 'cursive' });
    this.add.text(410, 400, 'Click to Restart', { fontSize: 45, fontFamily: 'cursive' });
    this.input.on('pointerup', () => {
      score = 0;
      time = 900;
      this.scene.restart();
    });
  } else if (time > 0 && score == 0) {
    time -= 1;
  }
  timer.setText("Time: " + time);
}