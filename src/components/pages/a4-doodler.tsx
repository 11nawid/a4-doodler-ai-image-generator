
"use client";

import { useState, type ChangeEvent, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger, DrawerTitle } from '@/components/ui/drawer';
import { Settings } from "lucide-react";

import ControlsPanel from "@/components/controls-panel";
import DrawingCanvas from "@/components/drawing-canvas";
import { useToast } from "@/hooks/use-toast";
import type { ColoredPath } from "@/types";
import AppNavbar from '@/components/app-navbar';
import { useIsMobile } from "@/hooks/use-mobile";

const generateDrawingWithWorker = (
  imageDataUrl: string,
  numPartners: number
): Promise<ColoredPath[][] | null> => {
  return new Promise((resolve, reject) => {
    const worker = new Worker("/drawing-worker.js");

    worker.onmessage = (e) => {
      if (e.data.status === "done") {
        resolve(e.data.path);
      } else if (e.data.status === "error") {
        reject(new Error(e.data.message));
      }
      worker.terminate();
    };

    worker.onerror = (e) => {
      reject(new Error(`Worker error: ${e.message}`));
      worker.terminate();
    };

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return reject(new Error("Could not get canvas context"));

      const A4_WIDTH = 210;
      const A4_HEIGHT = 297;

      const imgAspectRatio = img.width / img.height;
      const a4AspectRatio = A4_WIDTH / A4_HEIGHT;

      let drawWidth, drawHeight, xOffset, yOffset;
      if (imgAspectRatio > a4AspectRatio) {
        drawWidth = A4_WIDTH;
        drawHeight = A4_WIDTH / imgAspectRatio;
        xOffset = 0;
        yOffset = (A4_HEIGHT - drawHeight) / 2;
      } else {
        drawHeight = A4_HEIGHT;
        drawWidth = A4_HEIGHT * imgAspectRatio;
        xOffset = (A4_WIDTH - drawWidth) / 2;
        yOffset = 0;
      }

      canvas.width = A4_WIDTH;
      canvas.height = A4_HEIGHT;

      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, A4_WIDTH, A4_HEIGHT);

      ctx.drawImage(img, xOffset, yOffset, drawWidth, drawHeight);
      const imageData = ctx.getImageData(0, 0, A4_WIDTH, A4_HEIGHT);

      worker.postMessage({ imageData, width: A4_WIDTH, height: A4_HEIGHT, numPartners }, [
        imageData.data.buffer,
      ]);
    };
    img.onerror = () => {
      reject(new Error("Failed to load image."));
    };
    img.src = imageDataUrl;
  });
};

export default function A4Doodler() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [drawingPath, setDrawingPath] = useState<ColoredPath[][] | null>(null);
  const [ballSize, setBallSize] = useState(1);
  const [penSpeed, setPenSpeed] = useState(4);
  const [isLoading, setIsLoading] = useState(false);
  const [usePartners, setUsePartners] = useState(false);
  const [numPartners, setNumPartners] = useState(2);
  const [isControlsOpen, setIsControlsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  const { toast } = useToast();
  const workerRef = useRef<Worker | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setDrawingPath(null);
        if (workerRef.current) {
          workerRef.current.terminate();
          workerRef.current = null;
          setIsLoading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!uploadedImage) return;

    if (workerRef.current) {
      workerRef.current.terminate();
    }

    setIsLoading(true);
    setDrawingPath(null);

    try {
      const partners = usePartners ? numPartners : 1;
      const resultPath = await generateDrawingWithWorker(uploadedImage, partners);
      if (resultPath && resultPath.length > 0) {
        setDrawingPath(resultPath);
      } else {
        toast({
          variant: "destructive",
          title: "Drawing Generation Failed",
          description:
            "Could not generate a drawing. The image might be too simple or uniform.",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error Generating Drawing",
        description:
          "Something went wrong while creating the drawing. Please try again.",
      });
    } finally {
      setIsLoading(false);
      workerRef.current = null;
      setIsControlsOpen(false); // Close sheet on mobile after generating
    }
  };

  const getSvgContent = () => {
    if (!drawingPath) return "";

    const cardBgColor = getComputedStyle(document.documentElement).getPropertyValue('--card').trim();

    const allPaths = drawingPath.flat();
    return `
      <svg width="210mm" height="297mm" viewBox="0 0 210 297" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="hsl(${cardBgColor})" />
        ${allPaths
          .map((coloredPath) => {
            const pathData = coloredPath.path
              .map((p, i) => {
                if (p.x < 0) return "";
                const command =
                  i === 0 ||
                  (coloredPath.path[i - 1] && coloredPath.path[i - 1].x < 0)
                    ? "M"
                    : "L";
                return `${command} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
              })
              .join(" ");
            return `<path d="${pathData}" fill="none" stroke="${
              coloredPath.color
            }" stroke-width="${
              ballSize * 0.5
            }" stroke-linecap="round" stroke-linejoin="round" />`;
          })
          .join("\n  ")}
      </svg>`;
  }

  const handleDownloadSVG = () => {
    const svgContent = getSvgContent();
    if (!svgContent) return;
    const dataUri =
      "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgContent);
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", "drawing.svg");
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
  };
  
  const downloadImage = (dataUrl: string, extension: 'png' | 'pdf') => {
    if (extension === 'pdf') {
        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4'
        });
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        pdf.addImage(dataUrl, 'PNG', 0, 0, pageWidth, pageHeight);
        pdf.save('drawing.pdf');
    } else {
        const linkElement = document.createElement("a");
        linkElement.setAttribute("href", dataUrl);
        linkElement.setAttribute("download", `drawing.${extension}`);
        document.body.appendChild(linkElement);
        linkElement.click();
        document.body.removeChild(linkElement);
    }
  };

  const convertSvgToImage = (extension: 'png' | 'pdf') => {
    const svgContent = getSvgContent();
    if (!svgContent) return;

    const canvas = document.createElement('canvas');
    const scale = 4;
    canvas.width = 210 * scale;
    canvas.height = 297 * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        downloadImage(dataUrl, extension);
        URL.revokeObjectURL(url);
    };
    
    img.onerror = (e) => {
        console.error("Failed to load SVG as image", e);
        toast({
            variant: "destructive",
            title: "Export Failed",
            description: "Could not convert the drawing to an image.",
        });
        URL.revokeObjectURL(url);
    }

    img.src = url;
  };

  const handleDownloadPNG = () => {
    convertSvgToImage('png');
  };

  const handleDownloadPDF = () => {
    convertSvgToImage('pdf');
  };

  const handleBallSizeChange = (value: number[]) => {
    setBallSize(value[0]);
  };

  const handlePenSpeedChange = (value: number[]) => {
    setPenSpeed(value[0]);
  };

  const handleUsePartnersChange = (checked: boolean) => {
    setUsePartners(checked);
  };

  const handleNumPartnersChange = (value: number[]) => {
    setNumPartners(value[0]);
  };

  const Controls = () => (
    <ControlsPanel
        uploadedImage={uploadedImage}
        isLoading={isLoading}
        drawingPath={drawingPath}
        ballSize={ballSize}
        penSpeed={penSpeed}
        usePartners={usePartners}
        numPartners={numPartners}
        onImageChange={handleImageChange}
        onGenerate={handleGenerate}
        onDownloadSVG={handleDownloadSVG}
        onDownloadPNG={handleDownloadPNG}
        onDownloadPDF={handleDownloadPDF}
        onBallSizeChange={handleBallSizeChange}
        onPenSpeedChange={handlePenSpeedChange}
        onUsePartnersChange={handleUsePartnersChange}
        onNumPartnersChange={handleNumPartnersChange}
        activeTab={activeTab}
        onTabChange={setActiveTab}
    />
  );

  return (
    <div className="flex h-screen flex-col">
        <AppNavbar>
          <div className="flex items-center justify-end md:hidden">
            <Drawer open={isControlsOpen} onOpenChange={setIsControlsOpen}>
                <DrawerTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Settings className="h-5 w-5" />
                        <span className="sr-only">Open Settings</span>
                    </Button>
                </DrawerTrigger>
                <DrawerContent className="max-h-[80vh]">
                  <DrawerTitle className="sr-only">Doodler Settings</DrawerTitle>
                  <div className="overflow-auto p-4">
                    <Controls />
                  </div>
                </DrawerContent>
            </Drawer>
          </div>
      </AppNavbar>
        <main className="flex-1 overflow-auto">
            <div className="container mx-auto grid h-full flex-1 grid-cols-1 items-stretch gap-12 px-4 py-8 md:grid-cols-12 md:gap-16">
              <div className="hidden md:col-span-4 md:block lg:col-span-3">
                <div className="sticky top-8 h-[calc(100vh-4rem-2rem)] overflow-y-auto pr-4">
                  <Controls />
                </div>
              </div>
              <div className="col-span-1 flex h-full items-center justify-center md:col-span-8 lg:col-span-9">
                 <div className="w-full h-full flex items-center justify-center">
                    <div className="w-full max-w-xl">
                        <DrawingCanvas
                            isLoading={isLoading}
                            drawingPath={drawingPath}
                            ballSize={ballSize}
                            penSpeed={penSpeed}
                        />
                    </div>
                </div>
              </div>
            </div>
        </main>
    </div>
  );
}
