
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ColoredPath, DrawingPath } from "@/types";

const pathData = (path: DrawingPath) => {
  if (!path || path.length === 0) return "";
  return path
    .map((p, i) => {
      const command = i === 0 || (path[i-1] && path[i-1].x < 0) ? "M" : "L";
      if (p.x < 0) return "";
      return `${command} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
    })
    .join(" ");
};

const PathAnimator = ({ 
    paths, 
    ballSize, 
    penSpeed,
    onDone,
    animationKey 
}: { 
    paths: ColoredPath[], 
    ballSize: number, 
    penSpeed: number,
    onDone: (completedPath: SVGPathElement) => void,
    animationKey: string 
}) => {
  const pathRef = useRef<SVGPathElement>(null);
  const pencilRef = useRef<SVGCircleElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentPath = useMemo(() => {
    if (currentIndex >= paths.length) return null;
    return paths[currentIndex];
  }, [currentIndex, paths]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [animationKey]);

  useEffect(() => {
    let frameId: number;
    if (currentPath && pathRef.current && pencilRef.current) {
      const pathElement = pathRef.current;
      const pencilElement = pencilRef.current;
      
      const d = pathData(currentPath.path);
      pathElement.setAttribute('d', d);

      if (!d.trim()) {
        setCurrentIndex(i => i + 1);
        return;
      }

      const totalLength = pathElement.getTotalLength();
      if (totalLength === 0) {
        setCurrentIndex(i => i + 1);
        return;
      }

      pathElement.style.strokeDasharray = `${totalLength}`;
      pathElement.style.strokeDashoffset = `${totalLength}`;
      pencilElement.style.opacity = '1';

      let start: number | null = null;
      const animationDuration = totalLength * (4 / penSpeed);

      const animate = (timestamp: number) => {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / animationDuration, 1);
        
        pathElement.style.strokeDashoffset = `${totalLength * (1 - progress)}`;
        
        const currentPoint = pathElement.getPointAtLength(totalLength * progress);
        pencilElement.setAttribute('cx', `${currentPoint.x}`);
        pencilElement.setAttribute('cy', `${currentPoint.y}`);

        if (progress < 1) {
          frameId = requestAnimationFrame(animate);
        } else {
          pencilElement.style.opacity = '0';
          const newPath = pathElement.cloneNode() as SVGPathElement;
          onDone(newPath);
          setCurrentIndex(i => i + 1);
        }
      };
      
      const startPos = pathElement.getPointAtLength(0);
      pencilElement.setAttribute('cx', `${startPos.x}`);
      pencilElement.setAttribute('cy', `${startPos.y}`);

      frameId = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(frameId);
    }
  }, [currentPath, onDone, penSpeed]);

  if(!currentPath) return null;

  return (
    <g>
      <path
        ref={pathRef}
        fill="none"
        stroke={currentPath.color}
        strokeWidth={ballSize * 0.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        ref={pencilRef}
        r={ballSize * 1.5}
        fill={currentPath.color}
        className="opacity-0 transition-opacity duration-300"
        style={{ filter: `drop-shadow(0 0 2px ${currentPath.color})` }}
      />
    </g>
  );
};

interface DrawingCanvasProps {
  isLoading: boolean;
  drawingPath: ColoredPath[][] | null;
  ballSize: number;
  penSpeed: number;
}

export default function DrawingCanvas({
  isLoading,
  drawingPath,
  ballSize,
  penSpeed,
}: DrawingCanvasProps) {
  const completedPathsGroupRef = useRef<SVGGElement>(null);
  const drawingId = useMemo(() => drawingPath ? Date.now().toString() : null, [drawingPath]);

  useEffect(() => {
    // Reset when a new drawing is generated
    if(drawingPath && drawingId && completedPathsGroupRef.current) {
      completedPathsGroupRef.current.innerHTML = '';
    }
  }, [drawingPath, drawingId]);
  
  const handlePathDone = (completedPath: SVGPathElement) => {
    // Instead of using state, directly append the completed path to the SVG group.
    // This avoids re-rendering the entire component and is much more performant.
    if (completedPathsGroupRef.current) {
      completedPathsGroupRef.current.appendChild(completedPath);
    }
  };

  return (
    <div className="relative w-full">
      <Card className="aspect-[210/297] w-full overflow-hidden rounded-lg shadow-lg">
        {isLoading ? (
          <div className="flex h-full w-full items-center justify-center bg-card p-8">
            <div className="w-full space-y-4">
              <Skeleton className="h-1/6 w-full" />
              <Skeleton className="h-1/6 w-3/4" />
              <Skeleton className="h-1/6 w-full" />
              <Skeleton className="h-1/6 w-5/6" />
              <Skeleton className="h-1/6 w-2/3" />
            </div>
          </div>
        ) : (
          <svg
            viewBox="0 0 210 297"
            className="h-full w-full bg-card"
            aria-label="Drawing canvas"
          >
            {/* Group for completed paths. This will be manipulated directly. */}
            <g ref={completedPathsGroupRef} key={`completed-group-${drawingId}`} />

            {/* Render animators for each partner's path set */}
            {drawingId && drawingPath?.map((partnerPath, index) => (
                <PathAnimator 
                    key={`animator-${drawingId}-${index}`}
                    animationKey={`animator-${drawingId}-${index}`}
                    paths={partnerPath}
                    ballSize={ballSize}
                    penSpeed={penSpeed}
                    onDone={handlePathDone}
                />
            ))}

            {!drawingPath && !isLoading && (
              <text
                x="105"
                y="148.5"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-muted-foreground font-sans text-sm"
              >
                Drawing will appear here
              </text>
            )}
          </svg>
        )}
      </Card>
      <div className="pointer-events-none absolute inset-0 rounded-lg border border-black/5"></div>
    </div>
  );
}
