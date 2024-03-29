import { Shapes, Shapes_, Tools, Tools_ } from "@/shared/interfaces";
import { CanvasObject, Shape, Rectangle, Text, Ellipse, Line, Arrow } from "./Objects";
import { IncorrectShapeError, IncorrectToolError } from "@/shared/errors";
import { CanvasId } from "@/shared/types";
import Conference from "./Conference";

export interface IMouseEvent {
  x: number;
  y: number;
}

export interface IWheelEvent {
  deltaY: number;
  x: number;
  y: number;
  event: Required<{
    preventDefault: () => void;
    stopPropagation: () => void;
  }>;
}

export class CanvasMouse {
    private selectedTool: Tools_ = Tools.Cursor;
    private selectedShape: Shapes_ = Shapes.Rectangle;
    private currentModifiedObject: CanvasObject | null = null;

    public currentColor: string = [
        "#",
        Math.floor(9 * Math.random()),
        Math.floor(9 * Math.random()),
        Math.floor(9 * Math.random()),
        Math.floor(9 * Math.random()),
        Math.floor(9 * Math.random()),
        Math.floor(9 * Math.random()),
    ].join("");

    constructor() {}

    public changeTool(tool: Tools_): void {
        this.selectedTool = tool;
    }

    public changeShape(shape: Shapes_): void {
        this.selectedShape = shape;
    }

    public down(event: IMouseEvent): void {
        console.log(this.currentTool);
        switch (this.selectedTool) {
        case Tools.Shapes:
            switch (this.selectedShape) {
            case Shapes.Rectangle:
                this.currentModifiedObject = new Rectangle(event.x, event.y);
                break;
            case Shapes.Ellipse:
                this.currentModifiedObject = new Ellipse(event.x, event.y);
                break;
            case Shapes.Line:
                this.currentModifiedObject = new Line(event.x, event.y);
                break;
            case Shapes.Arrow:
                this.currentModifiedObject = new Arrow(event.x, event.y);
                break;
            default:
                throw new IncorrectShapeError(this.selectedShape);
            }
            break;
        case Tools.Text:
            this.currentModifiedObject = new Text(event.x, event.y);
            break;
        default:
            this.currentModifiedObject = null;
            if (
                this.selectedTool !== Tools.Cursor
          && this.selectedTool !== Tools.Pen
            ) {
                throw new IncorrectToolError(this.selectedTool);
            }
        }
    }

    public move(event: IMouseEvent): void {
        if (!this.currentModifiedObject) return;

        switch (this.selectedTool) {
        case Tools.Shapes:
            if (!(this.currentModifiedObject instanceof Shape)) return;
            this.currentModifiedObject.change(event.x, event.y);
            break;
        default:
            this.currentModifiedObject = null;
            if (
                this.selectedTool !== Tools.Cursor
          && this.selectedTool !== Tools.Text
          && this.selectedTool !== Tools.Pen
            ) {
                throw new IncorrectToolError(this.selectedTool);
            }
        }
    }

    public up(event: IMouseEvent): void {
        if (!this.currentModifiedObject) return;

        switch (this.selectedTool) {
        case Tools.Shapes:
            if (!(this.currentModifiedObject instanceof Shape)) return;
            this.currentModifiedObject.end(event.x, event.y);
            break;
        default:
            this.currentModifiedObject = null;
            if (
                this.selectedTool !== Tools.Cursor
          && this.selectedTool !== Tools.Text
          && this.selectedTool !== Tools.Pen
            ) {
                throw new IncorrectToolError(this.selectedTool);
            }
        }
    // TODO: Make it work (send an event to the parent)
    // if ( this.selectedTool !== Tools.Pen ) this.changeTool(Tools.Cursor);
    }

    public get currentObject(): CanvasObject | null {
        return this.currentModifiedObject;
    }

    public get currentTool(): Tools_ {
        return this.selectedTool;
    }
}

export abstract class Canvas {
    public id: CanvasId;

    protected _canvasMouse: CanvasMouse;

    protected _conference: Conference | undefined;

    constructor(id: CanvasId, conference?: Conference) {
        this.id = id;

        this._canvasMouse = new CanvasMouse();
        this._conference = conference;
    }

    abstract update(data: string): void

    public set canvasMouse(canvasMouse: CanvasMouse) {
        this._canvasMouse = canvasMouse;
    }

    public set conference(conference: Conference) {
        this._conference = conference;
    }

    public sendToConference(data: object): void {
        console.log("Sending to conference", {"target": this.id, ...data});
        this._conference?.send({"target": this.id, ...data});
    }

    public changeTool(tool: Tools_): void {
        this._canvasMouse.changeTool(tool);
    }

    public changeShape(shape: Shapes_): void {
        this._canvasMouse.changeShape(shape);
    }

  abstract mouseDown(event: IMouseEvent): void;

  abstract mouseMove(event: IMouseEvent): void;

  abstract mouseUp(event: IMouseEvent): void;
}
