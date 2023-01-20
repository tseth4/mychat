import { useEffect } from "react";

export default function autoSizeTextArea(
  textAreaRef: HTMLTextAreaElement | null,
  value: string,
  maxHeight: number
) {
  useEffect(() => {
    if (textAreaRef) {
      textAreaRef.style.height = "0px";
      const scrollHeight =
        textAreaRef.scrollHeight > maxHeight
          ? maxHeight
          : textAreaRef.scrollHeight;
      textAreaRef.style.height = scrollHeight + "px";
    }
  }, [textAreaRef, value]);
}
