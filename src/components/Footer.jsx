import React from 'react';

const Footer = () => {
    return (
        <footer className="border-t border-border bg-muted/30 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid gap-8 grid-cols-1 md:grid-cols-4 lg:gap-12">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <img src="/logo.png" alt="RiGG" className="h-8 w-auto" />
                            <span className="text-xl font-bold tracking-tight">RiGG</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Gear chaos ends here.
                        </p>
                    </div>
                    <div>
                        <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">Product</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
                            <li><a href="#wishlist" className="hover:text-primary transition-colors">Pricing</a></li>
                            <li><a href="#wishlist" className="hover:text-primary transition-colors">Download</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">Company</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">Legal</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Terms</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} RiGG. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
