
class NPC extends Entity {
    constructor(engine, x, y, slug='slime') {
        super(engine, slug)

        this.x = x
        this.y = y
        this.hp = 5
        this.width = 32
        this.height = 32
        this.damage = 10
        this.step = .8

        this.spriteController = new SpriteController({
            url: `assets/npc/${slug}.png`,
            slug: slug,
            width: this.width,
            height: this.height,
            framesX: { idle: 0, run: 5, attack: 6, die: 4},
            framesY: { idle: 0, run: 1, attack: 2, die: 4},
        })

        this.spriteController.animation = 'run'
    }

    draw() {
        this.superDraw()
    }

    update() {

        this.updateSuper()

        if (this.spriteController.animation != 'die') {
            if (this.attacking) {
                this.spriteController.animation = 'attack'
            } else {
                this.spriteController.animation = 'run'
            }
            this.follow(PLAYER_LIST[0])
        }
        this.draw()
    }

    follow(player) {
        if (
            player.x - this.x > this.width || 
            player.y - this.y > this.height ||
            player.x - this.x < -player.width  || 
            player.y - this.y < -player.height
            ) {
                this.attacking = false
                if ( player.x > this.x) this.x += this.step
                if ( player.x < this.x) this.x -= this.step
                if ( player.y > this.y) this.y += this.step
                if ( player.y < this.y) this.y -= this.step
        } else {
            this.attacking = true
        }
        
    }

    die() {
        PLAYER_LIST[0].addPoints(5); //5 pontos ao jogador
        PLAYER_LIST[0].addMonstrosAbatidos(); //contador de monstros abatidos
        super.updateSuper(); 
    }
    

}

