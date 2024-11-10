export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const calculateBoundingBox = (points: Array<{ x: number; y: number }>, padding = 10): BoundingBox | null => {
  if (!points || points.length < 2) {
    return null;
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  points.forEach(point => {
    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
  });

  // Add padding and ensure box is at least 10x10
  const width = Math.max(maxX - minX + (padding * 2), 10);
  const height = Math.max(maxY - minY + (padding * 2), 10);

  return {
    x: minX - padding,
    y: minY - padding,
    width,
    height
  };
};

export const calculateGlobalBoundingBox = (strokes: Array<any>, padding = 10): BoundingBox | null => {
  if (!strokes || strokes.length === 0) {
    return null;
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  strokes.forEach(stroke => {
    if (stroke.type === "draw") {
      // For draw strokes, get coordinates from the SVG path
      const coordinates = stroke.path.split(/[A-Z ,]/).filter(Boolean).map(Number);
      for (let i = 0; i < coordinates.length; i += 2) {
        const x = coordinates[i];
        const y = coordinates[i + 1];
        if (!isNaN(x) && !isNaN(y)) {
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      }
    } else if (stroke.type === "text" && stroke.position) {
      // For text strokes, use the position
      minX = Math.min(minX, stroke.position.x);
      minY = Math.min(minY, stroke.position.y);
      // Approximate text boundaries based on font size
      maxX = Math.max(maxX, stroke.position.x + (stroke.text.length * stroke.fontSize * 0.6));
      maxY = Math.max(maxY, stroke.position.y + stroke.fontSize);
    }
  });

  if (minX === Infinity || minY === Infinity) {
    return null;
  }

  // Add padding and ensure box is at least 10x10
  const width = Math.max(maxX - minX + (padding * 2), 10);
  const height = Math.max(maxY - minY + (padding * 2), 10);

  return {
    x: minX - padding,
    y: minY - padding,
    width,
    height
  };
};

export const drawSelectionBox = (
  ctx: CanvasRenderingContext2D,
  box: BoundingBox,
  scale: number,
  isActive: boolean = false
) => {
  const dashLength = 5 / scale;
  
  // Save context state
  ctx.save();
  
  // Set styles for selection box
  ctx.strokeStyle = isActive ? '#2196f3' : '#0099ff';
  ctx.lineWidth = 1.5 / scale;
  ctx.setLineDash([dashLength, dashLength]);
  ctx.lineDashOffset = 0;
  
  // Draw main selection box
  ctx.beginPath();
  ctx.rect(box.x, box.y, box.width, box.height);
  ctx.stroke();
  
  // Draw handles only if box is active
  if (isActive) {
    const handleSize = 8 / scale;
    ctx.setLineDash([]); // Solid line for handles
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#2196f3';
    ctx.lineWidth = 1 / scale;
    
    // Corner handles
    const handles = [
      { x: box.x - handleSize / 2, y: box.y - handleSize / 2 }, // Top-left
      { x: box.x + box.width - handleSize / 2, y: box.y - handleSize / 2 }, // Top-right
      { x: box.x - handleSize / 2, y: box.y + box.height - handleSize / 2 }, // Bottom-left
      { x: box.x + box.width - handleSize / 2, y: box.y + box.height - handleSize / 2 }, // Bottom-right
      { x: box.x + (box.width / 2) - handleSize / 2, y: box.y - handleSize / 2 }, // Top-middle
      { x: box.x + (box.width / 2) - handleSize / 2, y: box.y + box.height - handleSize / 2 }, // Bottom-middle
      { x: box.x - handleSize / 2, y: box.y + (box.height / 2) - handleSize / 2 }, // Left-middle
      { x: box.x + box.width - handleSize / 2, y: box.y + (box.height / 2) - handleSize / 2 }, // Right-middle
    ];
    
    handles.forEach(handle => {
      ctx.beginPath();
      ctx.rect(handle.x, handle.y, handleSize, handleSize);
      ctx.fill();
      ctx.stroke();
    });
  }
  
  // Restore context state
  ctx.restore();
};