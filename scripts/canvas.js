let canvas = document.getElementById("canvas"),
    cnv = canvas.getContext("2d"),
    w = window.innerWidth - 16,
    h = window.innerHeight - 20,
    activeColor = "red",
    defaultColor = "white",
    isDown = false,
    list = {
        polygon1: new Polygon([[0, 0], [0, 90], [90, 90], [90, 0]], 66, 50),
        polygon2: new Polygon([[110, 0], [0, 70], [0, 140], [100, 130]], 60, 160),
        polygon3: new Polygon([[10, 90], [50, 10], [100, 90]], 60, 310),
        polygon4: new Polygon([[0,90], [60, 0], [120, 0], [180, 90]], 30, 420),
    },
    render = function () {
        cnv.fillStyle = defaultColor;
        cnv.fillRect(0, 0, w, h);
        for (let shape in list) {
            if (list.hasOwnProperty(shape)) {
                list[shape].draw(cnv);
            }
        }
        requestAnimationFrame(render);
    };

canvas.addEventListener("mousedown", (e) => {
    isDown = true;
    checkPolygons({x: e.clientX, y: e.clientY});
});

canvas.addEventListener("mouseup", () => {
    isDown = false;
    for (let figure in list) {
        list[figure].moving = false;
    }
});

canvas.addEventListener("mousemove", (e) => {
    let polygon;
    if (isDown) {
        for (let figure in list) {
            polygon = list[figure];
            if (polygon.moving) {
                polygon.move(e.clientX - polygon.delta.x, e.clientY - polygon.delta.y);
                for (let f in list) {
                    list[f].color = defaultColor;
                }

                for (let firstFigure in list) {
                    for (let secondFigure in list) {
                        if (list[firstFigure] !== list[secondFigure] && list[firstFigure].checkCollision(list[secondFigure]))
                            list[firstFigure].color = list[secondFigure].color = activeColor;
                    }
                }

            }
        }
    }
});

function checkPolygons(mp) {
    for (let figure in list) {
        if (isPointInPolygon(list[figure].points, {x: mp.x - list[figure].x, y: mp.y - list[figure].y})) {
            list[figure].moving = true;
            list[figure].delta = {
                x: mp.x - list[figure].x,
                y: mp.y - list[figure].y
            };
        }
    }
}

function isPointInPolygon(polygon, pt) {
    for (var c = false, i = -1, l = polygon.length, j = l - 1; ++i < l; j = i)
        ((polygon[i].y <= pt.y && pt.y < polygon[j].y) || (polygon[j].y <= pt.y && pt.y < polygon[i].y))
        && (pt.x < (polygon[j].x - polygon[i].x) * (pt.y - polygon[i].y) / (polygon[j].y - polygon[i].y) + polygon[i].x)
        && (c = !c);
    return c;
}

canvas.width = w;
canvas.height = h;

requestAnimationFrame(render);
