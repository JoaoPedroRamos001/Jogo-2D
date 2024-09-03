class Player extends Entity {
    constructor(engine, slug = 'player') {
        super(engine, slug);
        this.x = 150;
        this.y = 100;
        this.width = 47;
        this.height = 47;
        this.damage = 5;
        this.hp = 300;
        this.maxHp = this.hp;
        this.points = 0;
        this.monstrosAbatidos = 0; //adicionado
        this.power_deplay = .3;
        this.keyboard = { left: false, right: false, up: false, down: false };
        this.attacking = false;
        this.facingDirection = 'right'; // adicionado(andar de costas)
        this.lastHitTime = Date.now();
        this.regenRate = 1; 
        this.regenDelay = 5000; 

        this.spriteController = new SpriteController({
            url: `assets/player/${slug}.png`,
            slug: slug,
            width: this.width,
            height: this.height,
            framesX: { idle: 0, run: 5, attack: 3, die: 4 },
            framesY: { idle: 0, run: 1, attack: 2, die: 4 },
        });

        this.events();
    }

    draw() {
        this.superDraw();
    }

    update() {
        this.updateSuper();

        //atualizar direção (andar de costas)
        if (this.keyboard.left) {
            this.x -= this.step;
            this.facingDirection = 'left';
        }
        if (this.keyboard.right) {
            this.x += this.step;
            this.facingDirection = 'right';
        }
        if (this.keyboard.up) this.y -= this.step;
        if (this.keyboard.down) this.y += this.step;

        if (this.spriteController.animation != 'die') {
            if (!this.attacking) {
                if (this.keyboard.left || this.keyboard.right || this.keyboard.up || this.keyboard.down) {
                    this.spriteController.animation = 'run';
                } else {
                    this.spriteController.animation = 'idle';
                    this.spriteController.col = 0;
                }
            } else {
                this.spriteController.animation = 'attack';
            }
        }
        this.draw();

        document.getElementById('hp').innerText = `HP: ${(this.hp * 100 / this.maxHp).toFixed(0)}%`;
        document.getElementById('points').innerText = `Pontos: ${this.points}`;
        document.getElementById('monsters').innerText = `Monstros Abatidos: ${this.monstrosAbatidos}`;
    }

    events() {
        document.body.addEventListener('keypress', this.press.bind(this));
        document.body.addEventListener('keyup', this.release.bind(this));

        document.body.addEventListener('mousedown', this.pressAttack.bind(this));
        document.body.addEventListener('mouseup', this.releaseAttack.bind(this));
    }

    pressAttack(e) {
        this.attacking = true;
        this.spriteController.col = 0;
    }
    
    releaseAttack(e) {
        this.attacking = false;
        this.spriteController.col = 0;
    }

    press(e) {
        if (e.key == 'a') this.keyboard.left = true;
        if (e.key == 'd') this.keyboard.right = true;
        if (e.key == 'w') this.keyboard.up = true;
        if (e.key == 's') this.keyboard.down = true;
    }

    release(e) {
        if (e.key == 'a') this.keyboard.left = false;
        if (e.key == 'd') this.keyboard.right = false;
        if (e.key == 'w') this.keyboard.up = false;
        if (e.key == 's') this.keyboard.down = false;
    }

    //pontuação
    addPoints(points) {
        this.points += points;
        document.getElementById('points').innerText = `Pontos: ${this.points}`;
    }

    addMonstrosAbatidos() {
        this.monstrosAbatidos += 1;
        document.getElementById('monsters').innerText = `Monstros Abatidos: ${this.monstrosAbatidos}`;
    }
}
