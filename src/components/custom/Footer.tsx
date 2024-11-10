import { useStrokesStore } from "@/store/strokesStore";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import StylingPallete from "./StylingPallete";
import { Undo2, Redo2, Palette, ZoomIn, ZoomOut} from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

const Footer = () => {
  const { undoStroke, redoStroke, handleZoom, scale } = useStrokesStore();
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);

  return (
    
    <div className="flex select-none cursor-default z-10">
      <div className="fixed bottom-4 left-4 rounded-lg shadow-lg z-10 border">
        <Button className="h-10 w-10 rounded" title="Zoom Out" variant="ghost" onClick={() => handleZoom(false)}>
          <ZoomOut className="h-2 w-2" />
        </Button>
        <Button  variant="ghost">{(scale * 100).toFixed(0)}%</Button>
        <Button variant="ghost" className="h-10 w-10 rounded" title="Zoom In" onClick={() => handleZoom(true)}>
          <ZoomIn className="h-2 w-2" />
        </Button>
          
        {/* <Button className="h-8 w-8 rounded" onClick={() => handleZoom(false)} variant="ghost">
          <ZoomOut className="w-3 h-3 bg-inherit" />
        </Button>
        <Button  variant="ghost">{(scale * 100).toFixed(0)}%</Button>
        <Button onClick={() => handleZoom(true)}  variant="ghost">
          <ZoomIn className="w-3 h-3 bg-inherit" />
        </Button> */}
        {/* <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger>
            <Button>
              <Palette className="w-5 h-5 bg-inherit" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-fit">
            <StylingPallete setIsPopoverOpen={setIsPopoverOpen} />
          </PopoverContent>
        </Popover> */}
      </div>
    </div>
  );
};

export default Footer;