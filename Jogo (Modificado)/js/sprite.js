class GameCache {
    constructor() {
        this.cached_images = {}
    }

    async get(slug, url) {
        let image = null;
        if (slug in this.cached_images) {
            image = this.cached_images[slug]
        } else {
            let image = new Image()
            await new Promise(r => image.onload = r, image.src = url)
            this.cached_images[slug] = image
        }
        return this.cached_images[slug]
    }
    
}

const gCache = new GameCache()

class SpriteController {
    constructor(config) {
        this.url = config.url
        this.framesX = config.framesX
        this.framesY = config.framesY
        this.frameWidth = config.width
        this.frameHeight = config.height
        this.slug = config.slug
        this.cached_images = {}

        this.animation = 'idle'
        this.col = this.framesX[this.animation]
        this.row = this.framesY[this.animation]

        this.load()
    }

    async load() {
        this.image = await gCache.get(this.slug, this.url);
        this.loop();
    }
    
    loop() {
        setInterval(() => {
            if (this.col == this.framesX[this.animation]) this.col = 0
            else this.col++
            this.row = this.framesY[this.animation]
        }, 100)
    }

    draw(engine, entity) {
        if (!this.image) return;
        
        let flipX = entity.facingDirection === 'left'; //costas
        let scaleX = flipX ? -1 : 1;
        let offsetX = flipX ? -this.frameWidth - entity.width : 0;
        
        engine.ctx.save(); //costas
        engine.ctx.scale(scaleX, 1); // costas
        engine.ctx.drawImage(
            this.image,
            this.col * this.frameWidth,
            this.row * this.frameHeight,
            this.frameWidth,
            this.frameHeight,
            entity.x * scaleX + offsetX,
            entity.y - entity.height,
            this.frameWidth + entity.width,
            this.frameHeight + entity.height
        );
    
        engine.ctx.restore(); //costas
    }
    
    
    }
