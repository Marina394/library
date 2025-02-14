import {fabric} from 'fabric';

export class PolygonShape extends fabric.Polygon {
    private canvas: any;
    private ctrlPressed: boolean;
    private isNewPointBeingAdded: boolean;

    constructor(canvas: any, x: number, y: number) {
        const radius = 50; // Радиус описанной окружности вокруг пятиугольника
        const points = [];
        const angleOffset = -Math.PI / 2; // Смещение, чтобы вершина была вверху
        const sides = 5; // Количество сторон

        // Генерация точек для пятиугольника
        for (let i = 0; i < sides; i++) {
            const angle = (2 * Math.PI * i / sides) + angleOffset;
            points.push({
                x: x + radius * Math.cos(angle), // X координата каждой вершины
                y: y + radius * Math.sin(angle)  // Y координата каждой вершины
            });
        }


        super(points, {
            fill: 'rgba(255, 0, 0, 0)',
            stroke: 'rgba(0, 0, 0, 1)',
            strokeWidth: 1,
            strokeUniform: true,
            objectCaching: false,
            transparentCorners: false,
            cornerColor: 'blue',
            lockScalingX: true,
            lockScalingY: true,
            hasRotatingPoint: true
        });

        ////

        this.canvas = canvas;
        this.ctrlPressed = false;
        this.isNewPointBeingAdded = false;

        document.addEventListener('keydown', (e) => {
            if (e.key === "Control") {
                this.ctrlPressed = true;
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.key === "Control") {
                this.ctrlPressed = false;
            }
        });

        this.canvas.on('mouse:up', () => {
            this.isNewPointBeingAdded = false;
        });
        ////////

        this.canvas.add(this);
        this.canvas.requestRenderAll();

        // Обработчик события при выборе полигона
        this.on('selected', () => {
            this.editPolygon(this);
        });


    }

    addPoint(anchorIndex, fabricObject) {
        let newPoint = {
            x: (fabricObject.points[anchorIndex].x + fabricObject.points[(anchorIndex + 1) % fabricObject.points.length].x) / 2,
            y: (fabricObject.points[anchorIndex].y + fabricObject.points[(anchorIndex + 1) % fabricObject.points.length].y) / 2
        };
        fabricObject.points.splice(anchorIndex + 1, 0, newPoint); // Вставляем новую точку после текущей
        this.updateControls(fabricObject);

        this.canvas.requestRenderAll();
    }



    updateControls(polygon) {
        const lastControl = polygon.points.length - 1;
        polygon.cornerStyle = 'circle';
        polygon.cornerColor = 'rgba(0,0,255,0.5)';

        polygon.controls = polygon.points.reduce((acc, point, index) => {
            const pointIndex = index;
            acc['p' + pointIndex] = new fabric.Control({
                positionHandler: (dim, finalMatrix, fabricObject) => {
                    return this.polygonPositionHandler(pointIndex, dim, finalMatrix, fabricObject);
                },
                actionHandler: this.anchorWrapper(index > 0 ? index - 1 : lastControl, this.actionHandler, this.addPoint),
                actionName: 'modifyPolygon',
                pointIndex: pointIndex,
            });

            return acc;
        }, {});
    }

    editPolygon(polygon: any): void {
        if (!polygon || !(polygon instanceof fabric.Polygon)) {
            console.error('Не выбран полигон для редактирования');
            return;
        }

        polygon.edit = !polygon.edit;

        if (polygon.edit) {
            const lastControl = polygon.points.length - 1;
            polygon.cornerStyle = 'circle';
            polygon.cornerColor = 'rgba(0,0,255,0.5)';

            this.updateControls(polygon);
        } else {
            polygon.cornerColor = 'blue';
            polygon.cornerStyle = 'rect';
            polygon.controls = fabric.Object.prototype.controls;
        }

        polygon.hasBorders = !polygon.edit;
        this.canvas.requestRenderAll();
    }

    actionHandler(eventData, transform, x, y) {
        const polygon = transform.target,
            currentControl = polygon.controls[polygon.__corner],
            mouseLocalPosition = polygon.toLocalPoint(new fabric.Point(x, y), 'center', 'center'),
            polygonBaseSize = this.getObjectSizeWithStroke(polygon),
            size = polygon._getTransformedDimensions(),
            finalPointPosition = {
                x: mouseLocalPosition.x * polygonBaseSize.x / size.x + polygon.pathOffset.x,
                y: mouseLocalPosition.y * polygonBaseSize.y / size.y + polygon.pathOffset.y
            };

        polygon.points[currentControl.pointIndex] = finalPointPosition;
        return true;
    }


    anchorWrapper(anchorIndex, fn, addPointFn) {
        return function (eventData, transform, x, y) {
            var fabricObject = transform.target;
            if (this.ctrlPressed && !this.isNewPointBeingAdded) {
                this.isNewPointBeingAdded = true;
                addPointFn.call(this, anchorIndex, fabricObject);
            }

            var absolutePoint = fabric.util.transformPoint({
                    x: (fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x),
                    y: (fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y),
                }, fabricObject.calcTransformMatrix()),
                actionPerformed = fn.call(this, eventData, transform, x, y),
                newDim = fabricObject._setPositionDimensions({}),
                polygonBaseSize = this.getObjectSizeWithStroke(fabricObject),
                newX = (fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x) / polygonBaseSize.x,
                newY = (fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y) / polygonBaseSize.y;

            fabricObject.setPositionByOrigin(absolutePoint, newX + 0.5, newY + 0.5);
            return actionPerformed;
        }.bind(this);
    }

    getObjectSizeWithStroke(object) {
        const stroke = object.strokeWidth * (object.strokeUniform ? 1 : Math.max(object.scaleX, object.scaleY));
        const sizeWithStroke = {
            x: object.width + stroke,
            y: object.height + stroke
        };
        return sizeWithStroke;
    }

    polygonPositionHandler(pointIndex, dim, finalMatrix, fabricObject) {
        const point = fabricObject.points[pointIndex];
        const x = point.x - fabricObject.pathOffset.x;
        const y = point.y - fabricObject.pathOffset.y;
        return fabric.util.transformPoint(
            {x, y},
            fabric.util.multiplyTransformMatrices(
                fabricObject.canvas.viewportTransform,
                fabricObject.calcTransformMatrix()
            )
        );
    }
}
