import { fabric } from "fabric";

import { CanvasObject, CanvasObjects, Shape, Text } from "./Objects";
import { Shapes } from "@/shared/interfaces";
import { IncorrectShapeError, IncorrectToolError } from "@/shared/errors";

export default class FabricDrawer {
  protected canvas: fabric.Canvas;
  protected currentFabricShape: fabric.Object | undefined;

  constructor(canvas: fabric.Canvas) {
    this.canvas = canvas;
    this.currentFabricShape = undefined;
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

  private addShape(shape: Shape): void {
    switch (shape.type) {
      case Shapes.Rectangle:
        this.currentFabricShape = new fabric.Rect({
          left: shape.initialX,
          top: shape.initialY,
          width: 0,
          height: 0,
        });
        break;
      case Shapes.Ellipse:
        this.currentFabricShape = new fabric.Ellipse({
          left: shape.initialX,
          top: shape.initialY,
          width: 0,
          height: 0,
        });
        break;
      case Shapes.Line:
        this.currentFabricShape = new fabric.Line([
            shape.initialX,
            shape.initialY,
            shape.directionX,
            shape.directionY,
        ],);
        break;
      case Shapes.Arrow:
        this.currentFabricShape = new fabric.Line([
          shape.initialX,
          shape.initialY,
          shape.directionX,
          shape.directionY,
        ])
      default:
        throw new IncorrectShapeError(shape.type);
    };
    this.canvas.add(this.currentFabricShape);
    this.canvas.renderAll();
  };

  private addText(text: Text): void {
    this.currentFabricShape = new fabric.IText(text.value, {
      left: text.initialX,
      top: text.initialY,
    });
    this.canvas.add(this.currentFabricShape);
    this.canvas.renderAll();
    this.canvas.setActiveObject(this.currentFabricShape);
    if (this.currentFabricShape instanceof fabric.IText) this.currentFabricShape.enterEditing();
  };

   private changeShape(shape: Shape): void {
    this.currentFabricShape?.set({
      left: shape.initialX,
      top: shape.initialY,
      width: shape.directionX,
      height: shape.directionY,
    });
    this.canvas.renderAll();
  };

  private endShape(shape: Shape): void {
    this.changeShape(shape);
    if (this.currentFabricShape) this.canvas.setActiveObject(this.currentFabricShape);
    this.currentFabricShape = undefined;
  };
};