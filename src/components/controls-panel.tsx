"use client";

import type { ChangeEvent } from "react";
import Image from "next/image";
import { ChevronDown, Download, FastForward, FileImage, FileJson, FileText, Loader, Pen, Settings, UploadCloud, Users, Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import type { ColoredPath } from "@/types";
import { Switch } from "./ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface ControlsPanelProps {
  uploadedImage: string | null;
  isLoading: boolean;
  drawingPath: ColoredPath[][] | null;
  ballSize: number;
  penSpeed: number;
  usePartners: boolean;
  numPartners: number;
  onImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onGenerate: () => void;
  onDownloadSVG: () => void;
  onDownloadPNG: () => void;
  onDownloadPDF: () => void;
  onBallSizeChange: (value: number[]) => void;
  onPenSpeedChange: (value: number[]) => void;
  onUsePartnersChange: (checked: boolean) => void;
  onNumPartnersChange: (value: number[]) => void;
  activeTab?: string;
  onTabChange?: (value: string) => void;
}

export default function ControlsPanel({
  uploadedImage,
  isLoading,
  drawingPath,
  ballSize,
  penSpeed,
  usePartners,
  numPartners,
  onImageChange,
  onGenerate,
  onDownloadSVG,
  onDownloadPNG,
  onDownloadPDF,
  onBallSizeChange,
  onPenSpeedChange,
  onUsePartnersChange,
  onNumPartnersChange,
  activeTab,
  onTabChange,
}: ControlsPanelProps) {
  const isMobile = useIsMobile();

  const ActionButtons = () => (
    <div className="flex flex-col gap-4">
      <Button
        onClick={onGenerate}
        disabled={!uploadedImage || isLoading}
        size="lg"
        className="bg-accent text-accent-foreground hover:bg-accent/90"
      >
        {isLoading ? (
          <Loader className="mr-2 h-5 w-5 animate-spin" />
        ) : null}
        {isLoading ? "Generating..." : "Generate Drawing"}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            disabled={!drawingPath || isLoading}
            variant="outline"
            size="lg"
          >
            <Download className="mr-2 h-5 w-5" />
            Download
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem onSelect={onDownloadSVG}>
            <FileJson className="mr-2 h-4 w-4" />
            <span>Download SVG</span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={onDownloadPNG}>
            <FileImage className="mr-2 h-4 w-4" />
            <span>Download PNG</span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={onDownloadPDF}>
            <FileText className="mr-2 h-4 w-4" />
            <span>Download PDF</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  const DesktopView = () => (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UploadCloud className="h-5 w-5" />
            Upload Image
          </CardTitle>
          <CardDescription>
            Select a photo to convert.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            id="picture-desktop"
            type="file"
            className="hidden"
            onChange={onImageChange}
            accept="image/*"
          />
          <Label
            htmlFor="picture-desktop"
            className="flex h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card hover:bg-muted/50"
          >
            {uploadedImage ? (
              <Image
                src={uploadedImage}
                alt="Uploaded preview"
                width={200}
                height={200}
                className="h-full w-full rounded-md object-contain p-2"
                data-ai-hint="user uploaded image"
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <UploadCloud className="h-8 w-8" />
                <span className="text-center font-medium">
                  Click to browse or drag & drop
                </span>
              </div>
            )}
          </Label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings
          </CardTitle>
          <CardDescription>
            Adjust the drawing parameters.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ball-size">Pen Size: {ballSize.toFixed(1)}px</Label>
            <div className="flex items-center gap-4">
              <Pen className="h-4 w-4 text-muted-foreground" />
              <Slider
                id="ball-size"
                min={0.5}
                max={5}
                step={0.1}
                value={[ballSize]}
                onValueChange={onBallSizeChange}
              />
              <Pen className="h-6 w-6 text-muted-foreground" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pen-speed">Pen Speed: {penSpeed.toFixed(1)}x</Label>
            <div className="flex items-center gap-4">
              <FastForward className="h-4 w-4 text-muted-foreground" />
              <Slider
                id="pen-speed"
                min={1}
                max={10}
                step={0.5}
                value={[penSpeed]}
                onValueChange={onPenSpeedChange}
              />
              <FastForward className="h-6 w-6 text-muted-foreground" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="partners-switch" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Partner Drawing
              </Label>
              <Switch id="partners-switch" checked={usePartners} onCheckedChange={onUsePartnersChange} />
            </div>
            {usePartners && (
              <div className="space-y-2">
                <Label htmlFor="num-partners">Number of Partners: {numPartners}</Label>
                <Slider
                  id="num-partners"
                  min={2}
                  max={5}
                  step={1}
                  value={[numPartners]}
                  onValueChange={onNumPartnersChange}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );

  const MobileView = () => (
    <div className="flex flex-col gap-6">
      <ActionButtons />
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">
            <UploadCloud className="mr-2 h-4 w-4" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>
        <TabsContent value="upload">
          <Card className="border-0 shadow-none">
            <CardHeader className="p-2 pt-4">
              <CardTitle className="flex items-center gap-2 sr-only">
                <UploadCloud className="h-5 w-5" />
                Upload Image
              </CardTitle>
              <CardDescription className="sr-only">
                Select a photo to convert.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2">
              <Input
                id="picture-mobile"
                type="file"
                className="hidden"
                onChange={onImageChange}
                accept="image/*"
              />
              <Label
                htmlFor="picture-mobile"
                className="flex h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card hover:bg-muted/50"
              >
                {uploadedImage ? (
                  <Image
                    src={uploadedImage}
                    alt="Uploaded preview"
                    width={200}
                    height={200}
                    className="h-full w-full rounded-md object-contain p-2"
                    data-ai-hint="user uploaded image"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <UploadCloud className="h-8 w-8" />
                    <span className="text-center font-medium">
                      Click to browse or drag & drop
                    </span>
                  </div>
                )}
              </Label>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings">
          <Card className="border-0 shadow-none">
            <CardHeader className="p-2 pt-4">
              <CardTitle className="flex items-center gap-2 sr-only">
                <Settings className="h-5 w-5" />
                Settings
              </CardTitle>
              <CardDescription className="sr-only">
                Adjust the drawing parameters.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-2">
              <div className="space-y-2">
                <Label>Pen Size</Label>
                <div className="flex items-center justify-between gap-2 rounded-lg border bg-background p-2">
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onBallSizeChange([Math.max(0.5, ballSize - 0.1)])} disabled={ballSize <= 0.5}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="flex-1 text-center font-medium">{ballSize.toFixed(1)}px</span>
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onBallSizeChange([Math.min(5, ballSize + 0.1)])} disabled={ballSize >= 5}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Pen Speed</Label>
                <div className="flex items-center justify-between gap-2 rounded-lg border bg-background p-2">
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onPenSpeedChange([Math.max(1, penSpeed - 0.5)])} disabled={penSpeed <= 1}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="flex-1 text-center font-medium">{penSpeed.toFixed(1)}x</span>
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onPenSpeedChange([Math.min(10, penSpeed + 0.5)])} disabled={penSpeed >= 10}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border bg-background p-2.5">
                  <Label htmlFor="partners-switch-mobile" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Partner Drawing
                  </Label>
                  <Switch id="partners-switch-mobile" checked={usePartners} onCheckedChange={onUsePartnersChange} />
                </div>
                {usePartners && (
                  <div className="space-y-2">
                    <Label>Number of Partners</Label>
                    <div className="flex items-center justify-between gap-2 rounded-lg border bg-background p-2">
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onNumPartnersChange([Math.max(2, numPartners - 1)])} disabled={numPartners <= 2}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="flex-1 text-center font-medium">{numPartners}</span>
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onNumPartnersChange([Math.min(5, numPartners + 1)])} disabled={numPartners >= 5}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
          A4 Doodler
        </h1>
        <p className="text-muted-foreground md:block hidden">
          Turn your photos into mesmerizing line art.
        </p>
        <p className="text-muted-foreground md:hidden">
          Turn photos into line art.
        </p>
      </div>

      <div className="hidden md:flex flex-col gap-4">
        <ActionButtons />
      </div>

      {isMobile ? <MobileView /> : <DesktopView />}
    </div>
  );
}
