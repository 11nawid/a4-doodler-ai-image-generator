
'use client';

import { useState } from 'react';
import NextImage from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Drawer, DrawerContent, DrawerTrigger, DrawerTitle } from '@/components/ui/drawer';
import { Settings } from 'lucide-react';
import ImageRestorerControls from '../image-restorer-controls';
import { restoreImage } from '@/ai/flows/restore-image-flow';
import AppNavbar from '@/components/app-navbar';

const Controls = ({
  isLoading,
  generatedImage,
  prompt,
  onPromptChange,
  onGenerate,
  onDownload,
}: {
  isLoading: boolean;
  generatedImage: string | null;
  prompt: string;
  onPromptChange: (value: string) => void;
  onGenerate: () => void;
  onDownload: () => void;
}) => (
  <ImageRestorerControls
      isLoading={isLoading}
      generatedImage={generatedImage}
      prompt={prompt}
      onPromptChange={onPromptChange}
      onGenerate={onGenerate}
      onDownload={onDownload}
  />
);


export default function ImageRestorer() {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isControlsOpen, setIsControlsOpen] = useState(false);
  const { toast } = useToast();
  
  const handleGenerate = async () => {
    if (!prompt) {
        toast({
            variant: 'destructive',
            title: 'Prompt is required',
            description: 'Please enter a prompt to generate an image.',
        });
        return;
    }

    setIsLoading(true);
    setGeneratedImage(null);

    try {
      // Set a timeout for the image generation
      const generationPromise = restoreImage({ prompt });
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Image generation timed out after 30 seconds.")), 30000)
      );

      const result = await Promise.race([generationPromise, timeoutPromise]) as { imageUrl: string };

      if (result && result.imageUrl) {
        setGeneratedImage(result.imageUrl);
      } else {
        toast({
          variant: 'destructive',
          title: 'Generation Failed',
          description: 'Could not generate an image. Please try again.',
        });
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong.';
      toast({
        variant: 'destructive',
        title: 'Error Generating Image',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
      setIsControlsOpen(false); // Close sheet on mobile
    }
  };
  
  const handleDownload = async () => {
    if (!generatedImage) return;
    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'generated-image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
       console.error("Download failed", error);
       toast({
         variant: 'destructive',
         title: 'Download Failed',
         description: 'Could not download the image. You can try right-clicking the image to save it.',
       });
    }
  };

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
                  <DrawerContent className="max-h-[60vh]">
                    <DrawerTitle className="sr-only">AI Generator Settings</DrawerTitle>
                    <div className="overflow-auto p-4 pt-0">
                        <Controls 
                          isLoading={isLoading}
                          generatedImage={generatedImage}
                          prompt={prompt}
                          onPromptChange={setPrompt}
                          onGenerate={handleGenerate}
                          onDownload={handleDownload}
                        />
                    </div>
                  </DrawerContent>
              </Drawer>
          </div>
      </AppNavbar>
      <main className="flex-1 overflow-hidden">
          <div className="container mx-auto grid h-full flex-1 grid-cols-1 items-stretch gap-12 px-4 py-8 md:grid-cols-12 md:gap-16">
            <div className="hidden md:col-span-4 md:block lg:col-span-3">
              <div className="sticky top-8 h-[calc(100vh-4rem-2rem)] overflow-y-auto pr-4">
                <Controls 
                  isLoading={isLoading}
                  generatedImage={generatedImage}
                  prompt={prompt}
                  onPromptChange={setPrompt}
                  onGenerate={handleGenerate}
                  onDownload={handleDownload}
                />
              </div>
            </div>
            <div className="col-span-1 flex h-full items-center justify-center md:col-span-8 lg:col-span-9">
              <div className="relative w-full">
                <Card className="aspect-square w-full overflow-hidden rounded-lg shadow-lg">
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
                      <div className="h-full w-full bg-card">
                          {generatedImage ? (
                              <NextImage
                                  src={generatedImage}
                                  alt="Generated image"
                                  layout="fill"
                                  objectFit="contain"
                                  className="p-2"
                                  unoptimized
                                  key={generatedImage}
                              />
                          ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                  <p className="text-muted-foreground font-sans text-sm">
                                      Your generated image will appear here
                                  </p>
                              </div>
                          )}
                      </div>
                  )}
                </Card>
                <div className="pointer-events-none absolute inset-0 rounded-lg border border-black/5"></div>
              </div>
            </div>
          </div>
      </main>
    </div>
  );
}
