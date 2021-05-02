import { Board } from './board/board';
import Icon from './images/Tower.png';


async function draw() {
  const myIcon = new Image();
  myIcon.src = Icon;

  var boardInstance = new Board(300, 300)
  
  boardInstance.drawBackground();
  boardInstance.drawRect();
  boardInstance.drawImg(Icon, 30, 30, 50, 80);
  document.body.appendChild(boardInstance.getCanvas());

  for(let i = 0 ; i <20 ; i ++) {
    await new Promise(r => setTimeout(r, 2));
    boardInstance.drawRect(30, 30+i*5, 50, 80);
    boardInstance.drawImg(Icon, 30, 30+i*5, 50, 80);
  }

}

draw()



