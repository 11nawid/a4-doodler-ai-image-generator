
import AppNavbar from '../app-navbar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

const faqData = {
    doodler: [
        {
            question: "How do I use the A4 Doodler?",
            answer: "Simply upload an image using the 'Upload Image' button. Once uploaded, you can adjust settings like Pen Size and Pen Speed. When you're ready, click 'Generate Drawing' to see the magic happen. The drawing process will be animated on the canvas."
        },
        {
            question: "What is 'Partner Drawing'?",
            answer: "Partner Drawing is a fun feature where multiple 'virtual artists' collaborate on your drawing simultaneously. You can choose between 2 to 5 partners. Each partner uses a different color, creating a unique, multi-colored artwork from your single uploaded image."
        },
        {
            question: "How can I download my drawing?",
            answer: "After a drawing is generated, the 'Download' button will become active. Click it to open a menu where you can choose to download your artwork as an SVG (vector), PNG (image), or PDF document."
        },
        {
            question: "The drawing animation is too slow/fast. Can I change it?",
            answer: "Yes! Use the 'Pen Speed' slider in the Settings panel to adjust the animation speed. A higher value will make the drawing complete faster, while a lower value will slow it down."
        }
    ],
    generator: [
        {
            question: "How does the AI Image Generator work?",
            answer: "The AI Image Generator uses a powerful text-to-image model. You provide a descriptive text prompt of what you want to see, and the AI interprets your words to create a unique image from scratch."
        },
        {
            question: "What kind of prompts work best?",
            answer: "Be as descriptive as possible! The more detail you provide, the better the AI can understand your vision. Try including details about the subject, setting, style, colors, and mood. For example, instead of 'a cat', try 'A photorealistic, fluffy ginger cat sleeping in a sunbeam on a wooden floor'."
        },
        {
            question: "Can I download the generated image?",
            answer: "Absolutely. Once the image is generated, click the 'Download Image' button to save it to your device as a PNG file."
        },
        {
            question: "Is there a limit to how many images I can generate?",
            answer: "The service we use is free and generally does not have hard limits for reasonable use. If you encounter any issues, please wait a moment and try again."
        }
    ]
}

export default function HelpPageContent() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <AppNavbar />
      <main className="flex-1">
        <div className="container mx-auto max-w-4xl px-4 py-12">
             <div className="mb-12 text-center">
                <h1 className="mb-2 text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                    Help & FAQ
                </h1>
                <p className="mx-auto max-w-3xl text-lg text-muted-foreground md:text-xl">
                    Find answers to common questions about our creative tools.
                </p>
            </div>

            <div className="space-y-12">
                <div>
                    <h2 className="mb-6 text-2xl font-semibold tracking-tight border-b pb-3">A4 Doodler</h2>
                     <Accordion type="single" collapsible className="w-full">
                        {faqData.doodler.map((item, index) => (
                             <AccordionItem value={`item-doodler-${index}`} key={index}>
                                <AccordionTrigger className="text-lg text-left">{item.question}</AccordionTrigger>
                                <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                                    {item.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>

                <div>
                    <h2 className="mb-6 text-2xl font-semibold tracking-tight border-b pb-3">AI Image Generator</h2>
                     <Accordion type="single" collapsible className="w-full">
                        {faqData.generator.map((item, index) => (
                             <AccordionItem value={`item-generator-${index}`} key={index}>
                                <AccordionTrigger className="text-lg text-left">{item.question}</AccordionTrigger>
                                <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                                    {item.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>

            </div>

        </div>
      </main>
    </div>
  );
}
