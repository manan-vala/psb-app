import { useRef } from 'react';
import * as Clipboard from 'expo-clipboard';

export function usePasteDetection() {
  const pasteDetected = useRef(false);
  const clipboardSnapshot = useRef<string>('');
  const previousValue = useRef<string>('');

  async function onFocusCapture() {
    clipboardSnapshot.current = await Clipboard.getStringAsync();
  }

  function onChangeTextCapture(newValue: string) {
    const delta = newValue.length - previousValue.current.length;
    if (delta > 4) {
      pasteDetected.current = true;
    }
    previousValue.current = newValue;
  }

  function isPasteDetected() {
    return pasteDetected.current;
  }

  function reset() {
    pasteDetected.current = false;
    clipboardSnapshot.current = '';
    previousValue.current = '';
  }

  return { onFocusCapture, onChangeTextCapture, isPasteDetected, reset };
}
