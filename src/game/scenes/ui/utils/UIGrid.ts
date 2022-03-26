import { GameDimensions } from "../../../GameDimensions";


const getUiGridCoords = (x0: number, y0: number, width: number, span: number, elementsNumber: number) => {
    let gridCoords = [];
    let columns = (width - width%span)/span;
    console.log(columns);

    let x = x0;
    let y = y0;
    
    for(let i = 0 ; i < elementsNumber ; i ++) {
        if(i%columns == 0) {
            x = x0;
            y+= span
        } else {
            x+=span;
        }
        gridCoords.push([x,y]);
    }
    return gridCoords
}
    

export { getUiGridCoords }