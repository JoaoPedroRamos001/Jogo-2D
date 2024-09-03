class CollisionController {
    constructor() {}

    resolveCollision(A, B) {
        if (!A || !B) return;

        if (B instanceof Tree) return;

        var vX = (A.x + (A.width / 2)) - (B.x + (B.width / 2)),
            vY = (A.y + (A.height / 2)) - (B.y + (B.height / 2)),
            ww2 = (A.width / 2) + (B.width / 2),
            hh2 = (A.height / 2) + (B.height / 2);

        let collided = false;

        if (Math.abs(vX) < ww2 && Math.abs(vY) < hh2) {
            var oX = ww2 - Math.abs(vX),
                oY = hh2 - Math.abs(vY);
            if (oX >= oY) {
                if (vY >= 0) {
                    A.y += oY;
                    collided = true;
                } else {
                    A.y -= oY;
                    collided = true;
                }
            } else {
                if (vX >= 0) {
                    A.x += oX;
                    collided = true;
                } else {
                    A.x -= oX;
                    collided = true;
                }
            }
        }

        if (collided) {
            if (A.attacking) A.applyDamage(B);
            if (B.attacking) B.applyDamage(A);
        }
    }
}
