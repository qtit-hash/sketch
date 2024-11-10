import { useStrokesStore } from "@/store/strokesStore";
import { Minus, Plus, ZoomIn, ZoomOut} from "lucide-react";
import { Button } from "../ui/button";


const Footer = () => {
  const {handleZoom, scale } = useStrokesStore();

  return (
<div className="inline-flex items-center gap-2 rounded-lg z-10 bg-background p-1 shadow-sm border fixed bottom-4 right-4">
  <Button
    variant="ghost"
    size="icon"
    className="h-8 w-8 shrink-0"
    onClick={() => handleZoom(false)}
  >
    <Minus className="h-4 w-4" />
    <span className="sr-only">Decrease zoom</span>
  </Button>
  <div className="min-w-[64px] text-center text-sm">
    {(scale * 100).toFixed(0)}%
  </div>
  <Button
    variant="ghost"
    size="icon"
    className="h-8 w-8 shrink-0"
    onClick={() => handleZoom(true)}
  >
    <Plus className="h-4 w-4" />
    <span className="sr-only">Increase zoom</span>
  </Button>
</div>



  );
};

export default Footer;