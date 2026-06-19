import React from 'react';

const Footer = ({ onPrivacyClick }) => {
    return (
        <footer className="border-t border-border bg-muted/30 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid gap-8 grid-cols-1 md:grid-cols-4 lg:gap-12">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <img src="/logo.png" alt="Master Camera" className="h-8 w-auto drop-shadow-md" />
                            <span className="text-xl font-bold tracking-tight">Master Camera</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Capture, organize, edit. All offline.
                        </p>
                    </div>
                    <div>
                        <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">Product</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
                            <li><a href="#wishlist" className="hover:text-primary transition-colors">Pricing</a></li>
                            <li>
                                <a
                                    href="#wishlist"
                                    aria-disabled="true"
                                    className="cursor-not-allowed opacity-60"
                                >
                                    Download (Coming soon)
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">Company</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                            <li><a href="mailto:hello@mastercamera.app" className="hover:text-primary transition-colors">Email: hello@mastercamera.app</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">Legal</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><button onClick={onPrivacyClick} className="hover:text-primary transition-colors cursor-pointer">Privacy</button></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Terms</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} Master Camera. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
