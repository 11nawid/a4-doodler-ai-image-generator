
'use client';

import { Download, Loader, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from './ui/textarea';

interface ImageRestorerControlsProps {
  isLoading: boolean;
  generatedImage: string | null;
  prompt: string;
  onPromptChange: (value: string) => void;
  onGenerate: () => void;
  onDownload: () => void;
}

export default function ImageRestorerControls({
  isLoading,
  generatedImage,
  prompt,
  onPromptChange,
  onGenerate,
  onDownload,
}: ImageRestorerControlsProps) {
  return (
    <div className="flex flex-col gap-8">
       <div className="flex flex-col gap-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
          AI Image Generator
        </h1>
        <p className="text-muted-foreground md:block hidden">
          Bring your ideas to life. Describe anything you can imagine and watch the AI create it.
        </p>
        <p className="text-muted-foreground md:hidden">
            Describe your idea and the AI will create it.
        </p>
      </div>

       <div className="flex flex-col gap-4">
        <Button
          onClick={onGenerate}
          disabled={isLoading || !prompt}
          size="lg"
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          {isLoading ? <Loader className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
          {isLoading ? 'Generating...' : 'Generate Image'}
        </Button>

        <Button
            onClick={onDownload}
            disabled={!generatedImage || isLoading}
            variant="outline"
            size="lg"
        >
            <Download className="mr-2 h-5 w-5" />
            Download Image
        </Button>
      </div>

      <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Describe your vision
            </CardTitle>
            <CardDescription>
                Be as descriptive as possible!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea 
                placeholder="e.g., A photorealistic majestic dragon..."
                value={prompt}
                onChange={(e) => onPromptChange(e.target.value)}
                rows={5}
            />
          </CardContent>
      </Card>
    </div>
  );
}
