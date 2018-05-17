
class Rect {
  constructor(maxWidth) {
    this.speed = intRand(1, 3);
    this.color = 'rgb(' + intRand(0, 255) + ', ' + intRand(0, 255) + ', ' + intRand(0, 255) + ')';
    this.width = 30;
    this.height = 30;
    this.y = 0 - this.width;
  
    this.x = intRand(this.width, maxWidth) - this.width;

    this.spawnInterval = null;
    this.renderInterval = null;
    this.isStarted = false;

  }
  updateYPosition() {
    this.y += this.speed;
  }
}

class Game {
  constructor(cnv, ctx) {
    this.cnv = cnv;
    this.ctx = ctx;
    this.rectCollection = [];
    this.params = {
      x: 'width',
      y: 'height'
    }
    this.score = null;
    this.scoreElement = document.getElementById('score');

  }

  init() {
    if(!this.isStarted) {
      let self = this;
      this.score = 0;
      this.displayScore();
      this.isStarted = true;
      this.spawnInterval = this.randomInvoke();
      this.renderInterval = setInterval(function () {
        self.render();
      }, 10);
    }
  }

  updateScore() {
    this.score++;
    this.displayScore();
  }

  displayScore() {
    this.scoreElement.textContent = this.score;
  }

  addRect() {
    this.rectCollection.push(new Rect(this.cnv.width));
  }

  stop() {
    if (this.isStarted && this.spawnInterval && this.renderInterval) {
      clearInterval(this.spawnInterval);
      clearInterval(this.renderInterval);
      this.clearField();
      this.rectCollection = [];
      this.score = 0;
      this.displayScore();
    }
  }

  clearField() {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);    
  }

  randomInvoke() {
    let self = this;
    return setInterval(function () {
      if (intRand(0, 1)) {
        self.addRect();
      }
    }, 200);
  }

  render() {
    this.clearField();
    for (let i in this.rectCollection) {
      if (this.rectCollection[i].y > this.ctx.height) {
        this.rectCollection.splice(i, 1);
      } else {
        this.draw(this.rectCollection[i]);
      }
    }
  }

  draw(rect) {
    this.ctx.fillStyle = rect.color;
    this.ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    rect.updateYPosition();
  }

  setClickHandler() {
    let self = this;
    this.cnv.addEventListener('click', function (e) {
      let collectionSnapshot = self.rectCollection.slice();
      self.checkCoordinates(self.getClickCoordinates(e), collectionSnapshot);
    });
  }

  getClickCoordinates(clickEvent) {
    return {
      x: clickEvent.clientX - this.cnv.offsetLeft,
      y: clickEvent.clientY - this.cnv.offsetTop
    }
  }

  checkCoordinates(coordinates, collectionSnapshot) {
    for (let i = collectionSnapshot.length - 1; i >= 0; i--) {
      if (this.checkInterval(collectionSnapshot[i], coordinates)) {
        this.rectCollection.splice(i, 1);
        this.updateScore();
      }
    }
  }

  checkInterval(rect, coordinates) {
    for (let i in this.params) {
      if (coordinates[i] >= rect[i] && coordinates[i] <= rect[i] + rect[this.params[i]]) {
        continue;
      } else {
        return false;
      }
    }
    return true
  }
}

function intRand(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

window.addEventListener('DOMContentLoaded', function () {
  let cnv = document.getElementById('canvas');
  let ctx = cnv.getContext('2d');
  let game = new Game(cnv, ctx);
  game.setClickHandler();
  setButtonHandlers(game);
});

function setButtonHandlers(game) {
  let buttons = document.getElementById('controls');
  buttons.addEventListener('click', function (e) {
    switch (e.target.id) {
      case 'start':
        game.init();
        break;
      case 'stop':
        game.stop();
    }
  });
}