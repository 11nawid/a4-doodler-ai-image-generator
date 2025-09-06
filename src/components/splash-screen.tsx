
import { Brush } from 'lucide-react';

export default function SplashScreen() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-background text-primary">
      <div className="relative">
        <Brush className="h-24 w-24 animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-32 w-32 animate-ping rounded-full bg-primary/20"></div>
        </div>
      </div>
      <p className="mt-4 text-lg font-semibold tracking-wider text-foreground">Doodler App</p>
    </div>
  );
}
