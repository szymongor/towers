class Board {

    constructor(height, width) {
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;
        console.log("board: "+width+":"+height);
    }

    getCanvas = function() {
        return this.canvas;
    }

    drawBackground = function() {
        var ctx = this.canvas.getContext("2d");
        ctx.fillStyle = "green";
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawImg = function(icon, posX, posY, sX, sY) {
        var img = new Image();
        
        img.onload = this.#drawLoadedImg(img, posX, posY, sX, sY);
        img.src = icon;
        var ctx = this.canvas.getContext("2d");
    }

    #drawLoadedImg = function(loadedImg, posX, posY, sX, sY) {
        return () => {
            var ctx = this.canvas.getContext("2d");
            ctx.drawImage(loadedImg, posX, posY, sX, sY);
            console.log("drawLoadedImg");
        } 
    }

    drawRect = function(posX, posY, sX, sY) {
        var ctx = this.canvas.getContext('2d');
        ctx.fillStyle = 'green';
        ctx.fillRect(posX, posY, sX, sY);
    }
    
};

export { Board }
