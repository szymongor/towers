import { bro } from './bro';
import Icon from './images/Tower.png';

console.log(bro('Pro'));



 function component() {
   const element = document.createElement('div');
  const myIcon = new Image();
  myIcon.src = Icon;

  element.appendChild(myIcon);

   return element;
 }

 document.body.appendChild(component());