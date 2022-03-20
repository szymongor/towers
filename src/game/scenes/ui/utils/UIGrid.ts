import { GameDimensions } from "../../../GameDimensions";


const getUiGridCoords = (width: number, heigth: number, columns: number, span: number, elementsNumber: number) => {
    let gridCoords = [];
    let x = 0;
    let y = 0;
    for(let i = 0 ; i < elementsNumber ; i ++) {
        if(x%columns == 0) {
            x = 0;
            y++;
        }
        gridCoords.push([x,y]);
        x++;
    }
    console.log(gridCoords);
    return gridCoords
}
    

export { getUiGridCoords }