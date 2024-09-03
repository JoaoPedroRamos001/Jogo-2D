class Entity {
    constructor(engine, slug) {
        this.id = Math.floor(Math.random() * 999999)
        this.engine = engine
        this.hp = 500
        this.x = 0
        this.y = 0
        this.damage = 0.5
        this.step = 2
        this.width = 50
        this.height = 50
        this.dead = false
        this.killing = false
        this.slug = slug
        this.hitted = false
        this.hitDisplayDuration = 0;

        this.power_deplay = 2 // seconds
        this.can_attack = true

    }

    superDraw() {
        this.engine.ctx.beginPath();
        this.spriteController.draw(this.engine, this);
    
        if (this.hitted || this.hitDisplayDuration > 0) {
            this.engine.ctx.beginPath();
            if (this.slug != 'player') {
                this.engine.ctx.fillStyle = this.isDead() ? '#FFD700' : '#00bcd4'; 
            } else {
                this.engine.ctx.fillStyle = '#f44336';
            }
    
            this.engine.ctx.font = 'bold 30px serif';
            this.engine.ctx.shadowColor = 'black';
            this.engine.ctx.shadowOffsetX = 1;
            this.engine.ctx.shadowOffsetY = 1;
            this.engine.ctx.strokeStyle = this.isDead() ? '#FFD700' : 'blue'; 
    
            if (this.isDead() && typeof this.hittedPoints === 'number') {
                this.engine.ctx.strokeText(`${this.hittedPoints}`, this.x, (this.y - 10));
                this.engine.ctx.fillText(`${this.hittedPoints}`, this.x, (this.y - 10));
                this.hitDisplayDuration--;
            } else if (typeof this.hitted === 'number') {
                this.engine.ctx.strokeText(`-${this.hitted}`, this.x, (this.y - 10));
                this.engine.ctx.fillText(`-${this.hitted}`, this.x, (this.y - 10));
            }
        }
    }
    
    

    updateSuper() {

        // basic wall collision
        if (this.x <= 0) this.x = 0
        if ((this.x + this.width) >= this.engine.canvas.width) 
            this.x = this.engine.canvas.width - this.width
        
        if (this.y <= 0) this.y = 0
        if ((this.y + this.height) >= this.engine.canvas.height) 
            this.y = this.engine.canvas.height - this.height
        
        // check if is dead
        if ( this.isDead() ) {
            if (!this.killing) {
                this.killing = true;
                this.spriteController.col = 0;
            }
            this.spriteController.animation = 'die';
            setTimeout(() => {
                if ( this.slug != 'player' ) {
                    for(let i in NPC_LIST) {
                        if (NPC_LIST[i].id == this.id) NPC_LIST.splice(i, 1);
                    }
                } else {
                    window.location.reload()
                }
            }, 350)
        }
    }

    applyDamage(enemy) {
        if (!this.can_attack) return;
        this.can_attack = false;
        let _this = this;
        enemy.hp -= _this.damage;
        enemy.hitted = _this.damage;
        
        if (enemy.isDead()) {
            enemy.hittedPoints = _this.damage; 
            _this.hitDisplayDuration = 60;
        }
        
        setTimeout(() => {
            _this.can_attack = true;
            enemy.hitted = false;
        }, this.power_deplay * 1000);
    }
    
    

    isDead() {
        return (this.hp <= 0)
    }
}