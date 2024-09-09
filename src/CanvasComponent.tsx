import { Canvas, Group, Textbox, Rect } from "fabric";
import { useEffect, useRef, useState } from "react";

export default function CanvasComponent() {
  const canvasEl = useRef(null);
  const [canvas, setCanvas] = useState<Canvas>();

  const handleAddGroup = () => {
    const text = new Textbox("Hello World", {
      height: 200,
      width: 200,
      fill: "blue",
      clipPath: new Rect({
        height: 200,
        width: 200,
        originX: "center",
        originY: "center",
      }),
    });

    const rect = new Rect({
      left: 0,
      top: 0,
      height: 200,
      width: 200,
      fill: "red",
    });

    const group = new Group([rect, text], {
      backgroundColor: "red",
      height: 200,
      width: 200,
      originX: "center",
      originY: "center",
      subTargetCheck: true,
      clipPath: null,
    });

    group.on('mousedown', (e) => {
      const { subTargets } = e;

      if (subTargets && !Array.isArray(subTargets) || subTargets.length === 0) return;

      subTargets.forEach((subTarget) => {
        if (!subTarget || !canvas || subTarget.type !== 'textbox') return;
        
        group.remove(subTarget);
        canvas.add(subTarget);

        subTarget.set({
          left: 0,
          top: 0
        });

        canvas.setActiveObject(subTarget);

        const onDeselected = () => {
          if (!group || !canvas) return;
          subTarget.set({
            left: 0,
            top: 0
          });
          group.add(subTarget);   
          canvas.remove(subTarget);
          subTarget.off('deselected', onDeselected);
        };

        subTarget.on('deselected', onDeselected);
      });

      canvas.renderAll();
    });

    canvas.add(group);
  };

  useEffect(() => {
    if (!canvasEl.current) {
      return;
    }
    const canvas = new Canvas(canvasEl.current, {
        // perPixelTargetFind: true,
        backgroundColor: "white",
        preserveObjectStacking: true
    });

    canvas.setHeight(window.innerHeight);
    canvas.setWidth(window.innerWidth);

    setCanvas(canvas);

    return () => {
      canvas.off("dragover");
      canvas.off("drop");
      canvas.dispose();
    };
  }, []);

  return (
    <div title="Editing - OpenArt AI">
      <button onClick={handleAddGroup}>Add Group</button>
      <canvas height="100%" width="100%" ref={canvasEl} />
    </div>
  );
}
