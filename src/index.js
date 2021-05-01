import { board } from './board';
import Icon from './images/Tower.png';


async function draw() {
  const myIcon = new Image();
  myIcon.src = Icon;

  var boardItem = board();
  var ctx = boardItem.getContext('2d');

  ctx.fillStyle = 'rgb(200, 130, 30)';
  ctx.fillRect(10, 10, 100, 100, 100, 100);

  await new Promise(r => setTimeout(r, 100));

  ctx.drawImage(myIcon, 30, 30, 50, 80);
  document.body.appendChild(boardItem);

}

draw()



