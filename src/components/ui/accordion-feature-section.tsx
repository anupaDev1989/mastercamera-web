"use client";

import { useState } from "react";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

interface FeatureItem {
    id: number;
    title: string;
    image: string;
    description: string;
}

interface Feature197Props {
    features: FeatureItem[];
}

const defaultFeatures: FeatureItem[] = [
    {
        id: 1,
        title: "Ready-to-Use UI Blocks",
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        description:
            "Browse through our extensive collection of pre-built UI blocks designed with shadcn/ui. Each block is carefully crafted to be responsive, accessible, and easily customizable. Simply copy and paste the code into your project.",
    },
    // ... other defaults omitted as we will pass props
];

const Feature197 = ({ features = defaultFeatures }: Feature197Props) => {
    const [activeTabId, setActiveTabId] = useState<number | null>(1);
    const [activeImage, setActiveImage] = useState(features[0].image);

    return (
        <section className="py-32">
            <div className="container mx-auto px-4">
                <div className="mb-12 flex w-full items-start justify-between gap-12">
                    <div className="w-full md:w-1/2">
                        <Accordion type="single" className="w-full" defaultValue={`item-${features[0].id}`}>
                            {features.map((tab) => (
                                <AccordionItem key={tab.id} value={`item-${tab.id}`}>
                                    <AccordionTrigger
                                        onClick={() => {
                                            setActiveImage(tab.image);
                                            setActiveTabId(tab.id);
                                        }}
                                        className="cursor-pointer py-5 !no-underline transition"
                                    >
                                        <h6
                                            className={`text-xl font-semibold ${tab.id === activeTabId ? "text-foreground" : "text-muted-foreground"}`}
                                        >
                                            {tab.title}
                                        </h6>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <p className="mt-3 text-muted-foreground">
                                            {tab.description}
                                        </p>
                                        <div className="mt-4 md:hidden">
                                            <img
                                                src={tab.image}
                                                alt={tab.title}
                                                className="h-full max-h-80 w-full rounded-md object-cover"
                                            />
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                    <div className="relative m-auto hidden w-1/2 justify-center md:flex">
                        <div className="relative w-full max-w-[320px] overflow-hidden rounded-[2rem] border-[8px] border-muted bg-background shadow-xl">
                            <img
                                src={activeImage}
                                alt="Feature preview"
                                className="h-auto w-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export { Feature197 };
