
import { Brush, BotMessageSquare, Sparkles, Cpu, Lightbulb, User } from 'lucide-react';
import AppNavbar from '../app-navbar';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const features = [
  {
    icon: Brush,
    title: 'A4 Doodler',
    description: 'Transform any photo into a mesmerizing piece of line art. Upload your image, adjust the settings, and watch as the app intelligently doodles a unique artistic interpretation on a virtual A4 canvas.',
  },
  {
    icon: BotMessageSquare,
    title: 'AI Image Generator',
    description: 'Unleash your imagination with the power of text-to-image AI. Simply describe the image you want to create, and our AI will bring your vision to life in stunning detail. From realistic portraits to fantastical landscapes, the possibilities are endless.',
  },
  {
    icon: Sparkles,
    title: 'Creative Freedom',
    description: 'Customize your creations with adjustable settings for pen size, speed, and even collaborative "partner" drawing. Download your final artwork as SVG, PNG, or PDF files to share and enjoy.',
  },
]

const attributions = [
    {
        icon: Cpu,
        title: 'A4 Doodler Engine',
        description: 'The doodling feature is powered by a custom client-side image processing algorithm. It runs entirely in your browser, analyzing the pixels of your uploaded photo and converting them into vector paths without sending your image to a server.',
    },
    {
        icon: Lightbulb,
        title: 'AI Image Generation Service',
        description: 'The AI Image Generator is powered by Pollinations.ai, a free and open-source platform for creating AI-generated media. We are grateful for their service, which allows for unlimited creative exploration.',
    }
]

export default function AboutPageContent() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <AppNavbar />
      <main className="flex-1">
        <div className="container mx-auto max-w-4xl px-4 py-12">
            <div className="mb-12 text-center">
                <h1 className="mb-2 text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                    About Doodler App
                </h1>
                <p className="mx-auto max-w-3xl text-lg text-muted-foreground md:text-xl">
                    A creative playground for turning photos into art and imagination into images.
                </p>
            </div>

            <div className="space-y-16">
                <div className="space-y-8">
                    <p className="text-center text-lg leading-relaxed">
                        The Doodler App is a powerful yet easy-to-use tool designed for artists, designers, and anyone with a creative spark. Our mission is to provide an intuitive platform where technology meets artistry, allowing you to explore new forms of digital creation effortlessly. Whether you're re-imagining your favorite photos or creating something entirely new from a text prompt, Doodler App is your partner in the creative process.
                    </p>

                    <div className="grid gap-8 md:grid-cols-1">
                        {features.map((feature) => (
                            <Card key={feature.title} className="flex flex-col md:flex-row items-start gap-6 p-6">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                                    <feature.icon className="h-6 w-6 text-primary" />
                                </div>
                                <div className="flex flex-col">
                                    <CardTitle>{feature.title}</CardTitle>
                                    <CardContent className="p-0 pt-2">
                                        <p className="text-muted-foreground">{feature.description}</p>
                                    </CardContent>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="text-center">
                        <h2 className="mb-2 text-3xl font-bold tracking-tighter sm:text-4xl">
                            Technology & Attributions
                        </h2>
                        <p className="mx-auto max-w-3xl text-lg text-muted-foreground md:text-xl">
                            Learn about the powerful tools that make this app possible.
                        </p>
                    </div>

                     <div className="grid gap-8 md:grid-cols-1">
                        {attributions.map((item) => (
                            <Card key={item.title} className="flex flex-col md:flex-row items-start gap-6 p-6">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                                    <item.icon className="h-6 w-6 text-primary" />
                                </div>
                                <div className="flex flex-col">
                                    <CardTitle>{item.title}</CardTitle>
                                    <CardContent className="p-0 pt-2">
                                        <p className="text-muted-foreground">{item.description}</p>
                                    </CardContent>
                                </div>
                            </Card>
                        ))}
                         <p className="text-center text-sm text-muted-foreground">
                            This application is proudly developed by Nawid Hussasin and built with Next.js, React, ShadCN, and Tailwind CSS.
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
