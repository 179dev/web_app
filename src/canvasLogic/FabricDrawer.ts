import { fabric } from "fabric";

import { CanvasObject, CanvasObjects, Shape, Text } from "./Objects";
import { Shapes } from "@/shared/interfaces";
import { IncorrectShapeError, IncorrectToolError } from "@/shared/errors";

export default class FabricDrawer {
  protected _canvas: fabric.Canvas;
  protected _currentFabricShape: fabric.Object | fabric.Line | fabric.Group | fabric.Ellipse | undefined;
  protected _strokeColor: string | undefined;

  constructor(_canvas: fabric.Canvas, _strokeColor?: string) {
    this._canvas = _canvas;
    this._currentFabricShape = undefined;
    this._strokeColor = _strokeColor;
  };

  public add(object: CanvasObject) {
    switch (object.objectType) {
      case CanvasObjects.Shape:
        this.addShape(object as Shape);
        break;
      case CanvasObjects.Text:
        this.addText(object as Text);
        break;
      default:
        throw new IncorrectToolError(CanvasObjects.Shape);
    }
  };

  public change(object: CanvasObject) {
    switch (object.objectType) {
      case CanvasObjects.Shape:
        this.changeShape(object as Shape);
        break;
      default:
        throw new IncorrectToolError(CanvasObjects.Shape);
    };
  };

  public end(object: CanvasObject) {
    switch (object.objectType) {
      case CanvasObjects.Shape:
        this.endShape(object as Shape);
        break;
      default:
        throw new IncorrectToolError(CanvasObjects.Shape);
    };
  };

  public set strokeColor(color: string) {
    this._strokeColor = color;
  };

  private addShape(shape: Shape): void {
    switch (shape.type) {
      case Shapes.Rectangle:
        this._currentFabricShape = new fabric.Rect({
          left: shape.initialX,
          top: shape.initialY,
          width: 0,
          height: 0,
          stroke: this._strokeColor ? this._strokeColor : 'black',
          fill: 'transparent',
        });
        break;
      case Shapes.Ellipse:
        this._currentFabricShape = new fabric.Ellipse({
          left: shape.initialX,
          top: shape.initialY,
          rx: 0,
          ry: 0,
          stroke: this._strokeColor ? this._strokeColor : 'black',
          fill: 'transparent',
          strokeWidth: 1,
        });
        break;
      case Shapes.Line:
        this._currentFabricShape = new fabric.Line([
            shape.initialX,
            shape.initialY,
            shape.directionX,
            shape.directionY,
        ], {
          stroke: this._strokeColor ? this._strokeColor : 'black',
        });
        break;
      case Shapes.Arrow:
        this._currentFabricShape = new fabric.Group([
          new fabric.Line([
            shape.initialX,
            shape.initialY,
            shape.directionX,
            shape.directionY,
          ], {
            stroke: this._strokeColor ? this._strokeColor : 'black',
            strokeWidth: 1,
          }),
          new fabric.Triangle({
            left: shape.directionX,
            top: shape.directionY,
            width: 10,
            height: 10,
            fill: this._strokeColor ? this._strokeColor : 'black',
            stroke: this._strokeColor ? this._strokeColor : 'black',
            strokeWidth: 1,
          }),
        ]);
        break;
      default:
        throw new IncorrectShapeError(shape.type);
    };
    if (this._currentFabricShape instanceof fabric.Group)
      for (let i = 0; i < this._currentFabricShape._objects.length; i++) 
        this._canvas.add(this._currentFabricShape.getObjects()[i]);
    else
      this._canvas.add(this._currentFabricShape);
    this._canvas.renderAll();
  };

  private addText(text: Text): void {
    this._currentFabricShape = new fabric.IText(text.value, {
      left: text.initialX,
      top: text.initialY,
    });
    this._canvas.add(this._currentFabricShape);
    this._canvas.renderAll();
    this._canvas.setActiveObject(this._currentFabricShape);
    if (this._currentFabricShape instanceof fabric.IText) this._currentFabricShape.enterEditing();
  };

   private changeShape(shape: Shape): void {
    switch (shape.type) {
      case Shapes.Rectangle:
        if (!(this._currentFabricShape instanceof fabric.Rect)) return;
        this._currentFabricShape?.set({
          left: shape.initialX,
          top: shape.initialY,
          width: shape.directionX,
          height: shape.directionY,
        });
        break;
      case Shapes.Ellipse:
        if (!(this._currentFabricShape instanceof fabric.Ellipse)) return;
        this._currentFabricShape?.set({
          left: shape.initialX,
          top: shape.initialY,
          rx: shape.directionX,
          ry: shape.directionY,
        });
        break;
      case Shapes.Line:
        if (!(this._currentFabricShape instanceof fabric.Line)) return;
        this._currentFabricShape?.set({
          x1: shape.initialX,
          y1: shape.initialY,
          x2: shape.directionX,
          y2: shape.directionY,
        });
        break;
      case Shapes.Arrow:
        if (!(this._currentFabricShape instanceof fabric.Group)) return;
        const [body, head] = this._currentFabricShape.getObjects();
        if (!(body instanceof fabric.Line && head instanceof fabric.Triangle)) return;
        body.set({
          x1: shape.initialX,
          y1: shape.initialY,
          x2: shape.directionX,
          y2: shape.directionY,
        });
        const dx = shape.directionX - shape.initialX;
        const dy = shape.directionY - shape.initialY;
        const angle = Math.atan2(dy, dx);
        head.set({
          left: shape.directionX + 10 * Math.sin(angle)/2,
          top: shape.directionY - 10 * Math.cos(angle)/2,
          angle: (angle * 180 / Math.PI) + 90,
        });
        break;
      default:
        throw new IncorrectShapeError(shape.type);
    }
    
    this._canvas.renderAll();
  };

  private endShape(shape: Shape): void {
    this.changeShape(shape);
    if (this._currentFabricShape)
      this._canvas.setActiveObject(this._currentFabricShape);
    this._currentFabricShape = undefined;
  };
};
