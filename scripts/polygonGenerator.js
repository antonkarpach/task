function Polygon(points, x, y) {
    this.x = x || 0;
    this.y = y || 0;
    this.points = points.map((element) => {
        return {x: element[0], y: element[1]};
    });
    this.getNormals();
}

Polygon.prototype.draw = function (ctx) {
    let p = this.points;

    ctx.save();
    ctx.fillStyle = this.color;
    ctx.strokeStyle = this.stroke;
    ctx.lineWidth = 1;
    ctx.translate(this.x, this.y);
    p.forEach((point, i) => {
        if (i === 0) {
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
        } else if (i === (p.length - 1)) {
            ctx.lineTo(point.x, point.y);
            ctx.lineTo(p[0].x, p[0].y);
            ctx.stroke();
            ctx.fill();
        } else {
            ctx.lineTo(point.x, point.y);
        }
    });
    ctx.closePath();
    ctx.restore();
};

Polygon.prototype.getNormals = function () {
    let p = this.points,
        n = p.length,
        crt, nxt, l, x1, y1;

    this.normals = [];
    for (let i = 0; i < n; i++) {
        crt = p[i];
        nxt = p[i + 1] || p[0];
        x1 = (nxt.y - crt.y);
        y1 = -(nxt.x - crt.x);
        l = Math.sqrt(x1 * x1 + y1 * y1);
        this.normals[i] = {x: x1 / l, y: y1 / l};
        this.normals[n + i] = {x: - x1 / l, y: - y1 / l};
    }
};

Polygon.prototype.move = function (x, y) {
    this.x = x;
    this.y = y;
};

Polygon.prototype.checkCollision = function (shape) {
    let me = this,
        p1, p2;

    return me.normals.concat(shape.normals).every((v) => {
        p1 = me.project(v);
        p2 = shape.project(v);
        return (((p1.min <= p2.max) && (p1.max >= p2.min)) ||
            (p2.min >= p1.max) && (p2.max >= p1.min));
    });
};

Polygon.prototype.project = function (vector) {
    let me = this,
        p = this.points,
        min = Infinity, max = -Infinity,
        x, y, proj;

    p.forEach((p) => {
        x = me.x + p.x;
        y = me.y + p.y;
        proj = (x * vector.x + y * vector.y);
        min = proj < min ? proj : min;
        max = proj > max ? proj : max;
    });

    return {min: min, max: max};
};
