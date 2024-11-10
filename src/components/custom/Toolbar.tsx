import React, { useCallback, useEffect } from "react";
import { useStrokesStore } from "@/store/strokesStore";
import { cn, Mode, ModeEnum } from "@/lib/utils";
import {
  Pencil,
  Type,
  Eraser,
  Move,
  MousePointer,
  Download,  // Import icon Download
  LucideIcon,
  Hand,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCanvas } from "@/hooks/useCanvas";

interface ModeConfig {
  mode: Mode;
  icon: LucideIcon;
  cursorStyle: string;
  label: string;
  shortcut: string;
  disabled?: boolean;
}

const modeConfigs: ModeConfig[] = [
  {
    mode: ModeEnum.DRAW,
    icon: Pencil,
    cursorStyle: "crosshair",
    label: "Draw",
    shortcut: "1",
  },
  {
    mode: ModeEnum.WRITE,
    icon: Type,
    cursorStyle: "text",
    label: "Write",
    shortcut: "2",
  },
  {
    mode: ModeEnum.ERASE,
    icon: Eraser,
    cursorStyle: "pointer",
    label: "Erase",
    shortcut: "4",
  },
  {
    mode: ModeEnum.SCROLL,
    icon: Move,
    cursorStyle: "grab",
    label: "Move",
    shortcut: "4",
  },
  {
    mode: ModeEnum.CURSOR,
    icon: MousePointer,
    cursorStyle: "default",
    label: "Select",
    shortcut: "4",
  },
  {
    mode: ModeEnum.MOVE,
    icon: Hand,
    cursorStyle: "default",
    label: "Select",
    shortcut: "6",
  },
  // Thêm chế độ Download vào modeConfigs
  {
    mode: ModeEnum.DOWNLOAD,
    icon: Download,  // Dùng icon Download
    cursorStyle: "default",
    label: "Download",
    shortcut: "D",  // Dùng phím tắt D
  }
];

const ModeButton: React.FC<{
  config: ModeConfig;
  isActive: boolean;
  onClick: () => void;
}> = ({ config, isActive, onClick }) => {
  //canvasref = HTMLCanvasElement
//   // bounding boxes = export interface BoundingBox {
//   x: number;
//   y: number;
//   width: number;
//   height: number;
// }
  const { boundingBox, canvasRef , clearCanvas } = useStrokesStore()
  const downloadRegion = () => {
    // Kiểm tra cả canvasRef.current
    if (!canvasRef?.current || !boundingBox) return;
  
    // Tạo canvas tạm thời để chứa vùng cần tải
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    if (!tempCtx) return;
  
    // Đặt kích thước cho canvas tạm thời bằng với vùng boundingBox
    tempCanvas.width = boundingBox.width;
    tempCanvas.height = boundingBox.height;
  
    // Copy vùng được chọn từ canvas gốc sang canvas tạm thời
    // Sử dụng canvasRef.current thay vì canvasRef
    tempCtx.drawImage(
      canvasRef.current,
      boundingBox.x,
      boundingBox.y,
      boundingBox.width,
      boundingBox.height,
      0,
      0,
      boundingBox.width,
      boundingBox.height
    );
  
    // Tạo link tải ảnh
    const link = document.createElement('a');
    link.download = 'canvas-region.png'; // Tên file khi tải về
    
    // Chuyển canvas thành URL
    tempCanvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.click();
        
        // Giải phóng URL sau khi tải xong
        URL.revokeObjectURL(url);
      }
    }, 'image/png');
  };
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isActive ? "default" : "ghost"}
            onClick={config.mode === ModeEnum.DOWNLOAD ? downloadRegion : onClick}
            size={"icon"}
            className="shadow-none h-8 w-8 rounded p-2 flex items-center justify-center"
          >
            <config.icon className="w-4 h-4 bg-inherit" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {config.label} (Press {config.shortcut})
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const Toolbar: React.FC = () => {
  const { updateMode, mode, updateCursorStyle } = useStrokesStore();

  const handleModeChange = useCallback(
    (newMode: Mode) => {
      const activeElement = document.activeElement;
      if (activeElement?.tagName === "TEXTAREA") return;

      const config = modeConfigs.find((c) => c.mode === newMode);
      if (config) {
        updateMode(config.mode);
        updateCursorStyle(config.cursorStyle);
      }
    },
    [updateMode, updateCursorStyle]
  );

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const config = modeConfigs.find((c) => c.shortcut === event.key);
      if (config && !config.disabled) {
        handleModeChange(config.mode);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleModeChange]);

  return (
    <nav className="flex items-center border md:rounded-xl flex items-center p-1 shadow-sm border z-5 mt-3">
      <ul className="flex items-center gap-2 rounded-lg p-1 max-w-full flex-wrap">
        {modeConfigs.map((config) => (
          <li key={config.mode} className="relative">
            <ModeButton
              config={config}
              isActive={mode === config.mode}
              onClick={() => handleModeChange(config.mode)}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Toolbar;
