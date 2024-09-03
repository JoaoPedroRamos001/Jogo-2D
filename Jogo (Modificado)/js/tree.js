class Tree {
    constructor(engine, x, y) {
        this.engine = engine;
        this.x = x;
        this.y = y;
        this.width = 80;
        this.height = 120;
        this.image = new Image();
        this.image.src = 'assets/arvore.png'; 
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}
