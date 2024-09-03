class Heart {
    constructor(engine, x, y) {
        this.engine = engine;
        this.x = x;
        this.y = y;
        this.width = 32; 
        this.height = 32; 
        this.image = new Image();
        this.image.src = 'assets/heart.png';
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    checkCollision(player) {
        return (player.x < this.x + this.width &&
                player.x + player.width > this.x &&
                player.y < this.y + this.height &&
                player.y + player.height > this.y);
    }
}
