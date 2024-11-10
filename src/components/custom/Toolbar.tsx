import React, { useCallback, useEffect } from "react";
import { useStrokesStore } from "@/store/strokesStore";
import { Mode, ModeEnum } from "@/lib/utils";
import {
  Pencil,
  Type,
  Eraser,
  Move,
  MousePointer,
  Download,
  LucideIcon,
  Hand,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  
];

const ModeButton: React.FC<{
  config: ModeConfig;
  isActive: boolean;
  onClick: () => void;
}> = ({ config, isActive, onClick }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={isActive ? "default" : "ghost"}
          onClick={onClick}
          className="rounded-lg shadow-none h-8 w-8 p-2 flex items-center justify-center"
        >
          <config.icon className="w-4 h-4 bg-inherit stroke-1" />
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

const Toolbar: React.FC = () => {
  const { updateMode, mode, updateCursorStyle, downloadImage } =
    useStrokesStore();
  const { toast } = useToast();

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

  const handleDownload = () => {
    downloadImage((message: string) =>
      toast({
        variant: "destructive",
        title: message,
        duration: 1000,
      })
    );
  };

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
    <nav className="flex items-center shadow-lg border md:rounded-xl mt-2 gap- p-1 z-10">
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
        <li>
          <Button variant="ghost" onClick={handleDownload} className="rounded-lg shadow-none h-8 w-8 p-2 flex items-center justify-center">
            <Download className="w-4 h-4 bg-inherit stroke-1" />
          </Button>
        </li>
      </ul>
    </nav>
  );
};

export default Toolbar;