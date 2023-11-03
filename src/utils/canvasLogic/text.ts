import { storeToRefs } from 'pinia';
import { useCanvasStore, useCanvasStateStore } from '@/store';
const canvasStore = useCanvasStore();
const canvasStateStore = useCanvasStateStore();
const { texts, currentText } = storeToRefs(canvasStore);
const { textInput } = storeToRefs(canvasStateStore);
import Konva from 'konva';

export function startText(evt: Konva.KonvaEventObject<MouseEvent>): void {
  if (textInput.value) textInput.value.value = '';
  currentText.value = {
    x: evt.evt.offsetX,
    y: evt.evt.offsetY,
    text: '',
  };
  if (!textInput.value) return;
  textInput.value.focus(); // FIXME: not working focus on input field
  texts.value.push({ ...currentText.value });
}

export function updateText(): void {
  if (!textInput.value) return;
  textInput.value.focus();
  currentText.value.text = textInput.value.value;
  texts.value.pop();
  texts.value.push({ ...currentText.value });
}