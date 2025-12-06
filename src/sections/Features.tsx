import React from 'react';
import { Feature197 } from '@/components/ui/accordion-feature-section';

const featuresList = [
    {
        id: 1,
        title: "Always Know What’s Available",
        description: "Instantly see which items are free, scheduled for a project, checked out, in repair, or missing. RiGG provides Smart status tracking to show if an item is available, scheduled, in use, reserved, in repair, or missing. Use Powerful search & filters to find gear by name, category, status, or location.",
        image: "/app-placeholder.svg"
    },
    {
        id: 2,
        title: "Turn Chaos into Ready-to-Go Kits",
        description: "Group cameras, lenses, audio, and accessories into reusable kits (e.g., Interview Kit, Run-and-Gun Kit) so you can pack for a shoot in minutes. The Live readiness indicator shows how prepared a kit is based on the availability of its components. You can also Duplicate kits for specific client needs or shoots.",
        image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    },
    {
        id: 3,
        title: "Plan Shoots with Confidence",
        description: "Create projects for shoots, events, and productions with start/end dates. Assign gear to projects to reserve individual items or whole kits. The app includes Conflict detection to warn you when the same item is booked on overlapping dates. You can also see the Readiness by project based on assigned and available gear.",
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    },
    {
        id: 4,
        title: "Track Maintenance by Usage, Not Just Date",
        description: "Create recurring or one-off Maintenance plans per item (e.g., servicing, calibration). RiGG uses Usage-based triggers (tracking by hours used or number of uses, like the Aputure 120d II or Sigma 24-70mm f/2.8) or time intervals (like Sensor Cleaning for the Sony A7S III). Receive Smart reminders when items are due or overdue.",
        image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    },
    {
        id: 5,
        title: "Protect Your Investment with Issue Tracking",
        description: "Log damage, missing items, and maintenance-related issues against specific items so nothing quietly fails on an important job. The app allows you to attach photos & notes and tracks issues through an Issue workflow (from open to resolved). Items can be automatically marked unavailable or \"Available with caution\" based on the issue's impact.",
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    },
    {
        id: 6,
        title: "Fast Packing & Comprehensive Logging",
        description: "Use Quick bulk checkout to check out all available items in a kit at once, with a clear summary of what’s missing. Enjoy Flexible checkout options, allowing you to check out gear to yourself, assign it to a project, or check out to a third party. Every transaction is recorded in a Full history log.",
        image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    },
    {
        id: 7,
        title: "Works On Set, Offline",
        description: "No Wi-Fi? No problem. RiGG stores everything locally so you can manage gear from anywhere. It Works 100% offline in Private Mode, requires No account to start organizing gear, and ensures Your data, your device with no analytics or tracking.",
        image: "/app-placeholder.svg"
    },
    {
        id: 8,
        title: "Team Mode & Shared Inventory (Coming Soon)",
        description: "This feature is optional and launching soon. The cloud-backed Team Mode with sync is planned for multi-device and multi-user access. This will enable a shared inventory and Role-based access (Owner, admin, member) to protect critical data.",
        image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    }
];

const Features = () => {
    return (
        <div id="features" className="bg-background">
            <div className="container mx-auto text-center pt-24 pb-0">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Everything you need to manage your gear</h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Powerful features designed for modern creators and production teams.
                </p>
            </div>
            <Feature197 features={featuresList} />
        </div>
    );
};

export default Features;
