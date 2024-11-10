import React, { useEffect, useState} from "react";
import { useStrokesStore } from "@/store/strokesStore";
import { ModeEnum, Stroke } from "@/lib/utils";
import { useCanvas } from "@/hooks/useCanvas";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import TextInput from "./TextInput";
import ConfirmationDialog from "./ConfirmationDialog";

const SketchCanvas: React.FC = () => {
  const [isWritingText, setIsWritingText] = useState(false);
  const [textBoxPosition, setTextBoxPosition] = useState({ x: 0, y: 0 });
  const [textValue, setTextValue] = useState("");
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState<boolean>(false);
  const [selectedStroke, setSelectedStroke] = useState<Stroke | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [originalStroke, setOriginalStroke] = useState<Stroke | null>(null); // Thêm state mới

  const { 
    mode, 
    strokeColor, 
    panOffset, 
    cursorStyle, 
    addStroke, 
    scale,
    strokes,
    updateStroke
  } = useStrokesStore((state) => state);

  const { canvasRef, handlePointerDown, handlePointerMove, handlePointerUp } = useCanvas();
  
  const handleCanvasClickOutside = () => {
    if (isWritingText && textValue.trim() !== "") {
      addStroke({
        type: "text",
        color: strokeColor,
        text: textValue,
        position: textBoxPosition,
        fontSize: 18,
        fontFamily: "sans",
      });
      setTextValue("");
      setIsWritingText(false);
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleCanvasClickOutside);
    return () => {
      window.removeEventListener("click", handleCanvasClickOutside);
    };
  }, [isWritingText, textValue]);

  const handleTextInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextValue(e.target.value);
  };

  useKeyboardShortcuts(handleCanvasClickOutside, setIsAlertDialogOpen);

  // Thêm hàm mới để kiểm tra point trong path
  const isPointInPath = (path: string, point: { x: number; y: number }): boolean => {
    const canvas = canvasRef.current;
    if (!canvas) return false;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;

    const path2D = new Path2D(path);
    return ctx.isPointInPath(path2D, point.x, point.y);
  };

  // Thêm hàm mới để tìm stroke được click
  const findClickedStroke = (x: number, y: number): Stroke | null => {
    for (let i = strokes.length - 1; i >= 0; i--) {
      const stroke = strokes[i];
      
      if (stroke.type === 'text' && stroke.position) {
        const textWidth = 100;
        const textHeight = 20;
        if (
          x >= stroke.position.x &&
          x <= stroke.position.x + textWidth &&
          y >= stroke.position.y &&
          y <= stroke.position.y + textHeight
        ) {
          return stroke;
        }
      } else if (stroke.type === 'draw' && stroke.path) {
        if (isPointInPath(stroke.path, { x, y })) {
          return stroke;
        }
      }
    }
    return null;
  };

  const handleCanvasPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (mode === ModeEnum.WRITE) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left - panOffset.x) / scale;
      const y = (e.clientY - rect.top - panOffset.y) / scale;

      setTextBoxPosition({ x, y });
      setIsWritingText(true);
    } else if (mode === ModeEnum.MOVE) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left - panOffset.x) / scale;
      const y = (e.clientY - rect.top - panOffset.y) / scale;

      const clickedStroke = findClickedStroke(x, y);

      if (clickedStroke) {
        setSelectedStroke(clickedStroke);
        setOriginalStroke(clickedStroke); // Lưu stroke gốc
        setIsDragging(true);
        setDragStart({ x, y });
        e.preventDefault(); // Ngăn các sự kiện mặc định
      }
    } else {
      handlePointerDown(e);
    }
  };

  const handleCanvasPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (mode === ModeEnum.MOVE && isDragging && selectedStroke && originalStroke) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left - panOffset.x) / scale;
      const y = (e.clientY - rect.top - panOffset.y) / scale;

      const dx = x - dragStart.x;
      const dy = y - dragStart.y;

      if (selectedStroke.type === 'text' && selectedStroke.position) {
        // Di chuyển text
        const updatedStroke = {
          ...selectedStroke,
          position: {
            x: originalStroke.position!.x + dx,
            y: originalStroke.position!.y + dy,
          },
        };
        updateStroke(updatedStroke);
        setSelectedStroke(updatedStroke);
      } else if (selectedStroke.type === 'draw' && selectedStroke.path) {
        // Di chuyển đường vẽ
        const pathCommands = selectedStroke.path.split(' ');
        let newPath = '';
        
        for (let i = 0; i < pathCommands.length; i++) {
          const command = pathCommands[i];
          if (command === 'M' || command === 'Q') {
            newPath += command + ' ';
          } else if (command === 'Z') {
            newPath += command;
          } else {
            // Di chuyển từng điểm trong path
            const coord = parseFloat(command);
            if (!isNaN(coord)) {
              const isX = i % 2 === 1;
              const originalCoord = parseFloat(originalStroke.path!.split(' ')[i]);
              newPath += (originalCoord + (isX ? dx : dy)) + ' ';
            }
          }
        }

        const updatedStroke = {
          ...selectedStroke,
          path: newPath,
        };
        updateStroke(updatedStroke);
        setSelectedStroke(updatedStroke);
      }
      e.preventDefault();
    } else {
      handlePointerMove(e);
    }
  };

  const handleCanvasPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (mode === ModeEnum.MOVE) {
      setIsDragging(false);
      setSelectedStroke(null);
      setOriginalStroke(null);
    } else {
      handlePointerUp(e);
    }
  };

  return (
    <div style={{ overflow: "hidden", width: "100%", height: "100%" }}>
      <canvas
        ref={canvasRef}
        onPointerDown={handleCanvasPointerDown}
        onPointerMove={handleCanvasPointerMove}
        onPointerUp={handleCanvasPointerUp}
        onTouchStart={(e) => e.preventDefault()}
        onTouchMove={(e) => e.preventDefault()}
        width={window.innerWidth}
        height={window.innerHeight}
        style={{
          cursor: cursorStyle,
          touchAction: "none",
        }}
      />

      {isWritingText && (
        <TextInput
          isWritingText={isWritingText}
          textBoxPosition={textBoxPosition}
          panOffset={panOffset}
          strokeColor={strokeColor}
          textValue={textValue}
          handleTextInput={handleTextInput}
          scale={scale}
        />
      )}

      <ConfirmationDialog
        isAlertDialogOpen={isAlertDialogOpen}
        onClose={() => setIsAlertDialogOpen(false)}
      />
    </div>
  );
};

export default SketchCanvas;