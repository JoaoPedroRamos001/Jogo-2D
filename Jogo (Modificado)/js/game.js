class GameEngine {
    constructor() {
        this.canvas = document.getElementById('game');
        this.ctx = this.canvas.getContext('2d');
        this.collisionController = new CollisionController();
        this.spawnPlayers();
        this.spawnNpcs();
        this.spawnTrees(); //adiciona árvores
        this.monstersKilled = 0;

        this.monsterDeathSounds = [
            new Audio('assets/sounds/monster_death.wav'),
            new Audio('assets/sounds/monster_death.wav'),
            new Audio('assets/sounds/monster_death.wav')
        ];
        this.monsterDeathSounds.forEach(sound => {
            sound.volume = 1.0;
            sound.addEventListener('canplaythrough', () => console.log(`Sound loaded: ${sound.src}`));
        });
        this.currentSoundIndex = 0;

        this.hearts = []; 
        this.startHeartGeneration(); 

        this.backgroundMusic = new Audio('assets/sounds/SomAmbiente.mp3');
        this.backgroundMusic.loop = true; 
        this.backgroundMusic.volume = 0.1; 
        this.backgroundMusic.addEventListener('canplaythrough', () => console.log('Background music loaded.'));
        this.backgroundMusic.play(); 

        this.render();
    }

    playDeathSound() {
        const sound = this.monsterDeathSounds[this.currentSoundIndex];
        sound.play().catch(error => console.error('Error playing sound:', error));
        this.currentSoundIndex = (this.currentSoundIndex + 1) % this.monsterDeathSounds.length;
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        PLAYER_LIST[0].update(this);

        for (let i = NPC_LIST.length - 1; i >= 0; i--) {
            NPC_LIST[i].update(this);

            if (NPC_LIST[i].isDead()) {
                NPC_LIST[i].die();
                this.playDeathSound();
                this.monstersKilled++;
                NPC_LIST.splice(i, 1);
            } else {
                this.collisionController.resolveCollision(PLAYER_LIST[0], NPC_LIST[i]);
            }
        }

        for (let tree of TREE_LIST) {
            tree.draw(this.ctx);
            this.collisionController.resolveCollision(PLAYER_LIST[0], tree);
        }

        for (let heart of this.hearts) {
            heart.draw(this.ctx);
            if (heart.checkCollision(PLAYER_LIST[0])) {
                PLAYER_LIST[0].hp = Math.min(PLAYER_LIST[0].maxHp, PLAYER_LIST[0].hp + 15);
                this.hearts = this.hearts.filter(h => h !== heart);
            }
        }

        if (PLAYER_LIST[0].isDead()) {
            this.showGameOver();
            this.saveGameData(); 
            this.backgroundMusic.pause(); 
            return; 
        }

        requestAnimationFrame(() => this.render());
    }

    spawnPlayers() {
        PLAYER_LIST.push(new Player(this));
    }

    spawnNpcs() {
        setInterval(() => {
            if (NPC_LIST.length < 5)
                NPC_LIST.push(new NPC(this, Math.random() * (this.canvas.width - 50), Math.random() * (this.canvas.height - 50)));
        }, 1000);
    }

    spawnTrees() {
        TREE_LIST = [];
        const numberOfTrees = 11;
        const minDistance = 80; // Distância

        for (let i = 0; i < numberOfTrees; i++) {
            let positionValid = false;
            let x, y;

            while (!positionValid) {
                x = Math.random() * (this.canvas.width - 50);
                y = Math.random() * (this.canvas.height - 50);
                
                positionValid = true;
                
                for (let tree of TREE_LIST) {
                    const dx = tree.x - x;
                    const dy = tree.y - y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < minDistance) {
                        positionValid = false;
                        break;
                    }
                }
            }
            
            TREE_LIST.push(new Tree(this, x, y));
        }
    }

    startHeartGeneration() {
        this.heartGenerationInterval = setInterval(() => {
            if (this.hearts.length < 5) {
                let x, y, positionValid = false;
                
                while (!positionValid) {
                    x = Math.random() * (this.canvas.width - 32);
                    y = Math.random() * (this.canvas.height - 32);
                    
                    positionValid = true;
                    
                    for (let tree of TREE_LIST) {
                        const dx = tree.x - x;
                        const dy = tree.y - y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        
                        if (distance < 50) { //tamanho das árvores
                            positionValid = false;
                            break;
                        }
                    }
                }
                
                this.hearts.push(new Heart(this, x, y));
            }
        }, 5000);
    }

    showGameOver() {
        const gameOverScreen = document.getElementById('game-over');
        const finalPoints = document.getElementById('final-points');
        const monstersKilledElem = document.getElementById('monsters-killed');
        const storyElem = document.getElementById('story');
        
        finalPoints.innerText = PLAYER_LIST[0].points;
        monstersKilledElem.innerText = this.monstersKilled;
        
        storyElem.innerText = "Você lutou bravamente e derrotou vários monstros. " +
            "No final, você morreu não concluindo sua missão de acabar com a praga dos slimes assim, condenando os aldeões. " +
            "Obrigado por jogar!";
        
        gameOverScreen.style.display = 'block';
    
        const restartButton = document.getElementById('restart-button');
        restartButton.addEventListener('click', () => {
            window.location.reload(); //reinicia o jogo
        });
    }

    async saveGameData() {
        const name = localStorage.getItem('playerName');
        const points = PLAYER_LIST[0].points;
        await savePlayer(name, points);
    }
}
