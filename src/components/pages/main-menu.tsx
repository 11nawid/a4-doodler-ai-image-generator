
'use client';

import Link from 'next/link';
import { Brush, BotMessageSquare, ArrowRight, Github } from 'lucide-react';
import AppNavbar from '../app-navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';

const menuItems = [
  {
    href: '/doodler',
    title: 'A4 Doodler',
    description: 'Convert your photos into beautiful line art drawings.',
    icon: Brush,
    cta: 'Start Doodling',
    external: false,
  },
  {
    href: '/restore',
    title: 'AI Image Generator',
    description: 'Bring your ideas to life with text-to-image AI generation.',
    icon: BotMessageSquare,
    cta: 'Start Generating',
    external: false,
  },
  {
    href: 'https://github.com/11nawid',
    title: 'About the Developer',
    description: 'Check out my other projects and contributions on GitHub.',
    icon: Github,
    cta: 'View on GitHub',
    external: true,
  }
];

export default function MainMenu() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <AppNavbar />
      <main className="flex flex-1 flex-col items-center justify-center p-4 text-center">
        <div className="mb-12">
            <h1 className="mb-2 text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                What will you create today?
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Choose a tool to start your creative journey, or learn more about the developer.
            </p>
        </div>

        <div className="grid w-full max-w-4xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            {menuItems.map((item) => (
                <Link 
                    href={item.href} 
                    key={item.href} 
                    passHref
                    target={item.external ? '_blank' : '_self'}
                    rel={item.external ? 'noopener noreferrer' : ''}
                >
                    <Card className="flex h-full transform-gpu cursor-pointer flex-col text-left transition-transform duration-300 ease-in-out hover:scale-[1.02] hover:shadow-xl">
                        <CardHeader className="flex-row items-start gap-4 space-y-0">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                <item.icon className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <CardTitle>{item.title}</CardTitle>
                                <CardDescription className="mt-1">
                                    {item.description}
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="mt-auto flex justify-end">
                            <Button variant="ghost" className="text-primary hover:text-primary">
                                {item.cta}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
      </main>
    </div>
  );
}
