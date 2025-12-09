import React from 'react';

const Platforms = () => {
  return (
    <section id="platforms" className="py-28 md:py-36 bg-background">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-5 font-heading text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Coming soon to App Store, Google Play &amp; Web
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            RiGG is launching across mobile and web so you can stay on top of your gear from set, studio, or anywhere in between.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 md:gap-8">
          <div className="flex items-center gap-4 rounded-full border border-border bg-card/90 px-7 py-3 shadow-lg">
            <img
              src="/ios-logo.svg"
              alt="Download on the App Store"
              className="h-10 w-10 md:h-12 md:w-12"
              loading="lazy"
            />
            <div className="flex flex-col items-start">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">Coming soon on</span>
              <span className="text-base md:text-lg font-semibold text-foreground">App Store</span>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-full border border-border bg-card/90 px-7 py-3 shadow-lg">
            <img
              src="/android-logo.svg"
              alt="Get it on Google Play"
              className="h-10 w-10 md:h-12 md:w-12"
              loading="lazy"
            />
            <div className="flex flex-col items-start">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">Coming soon on</span>
              <span className="text-base md:text-lg font-semibold text-foreground">Google Play</span>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-full border border-border bg-card/90 px-7 py-3 shadow-lg">
            <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-primary/10 text-primary text-sm md:text-base font-semibold">
              Web
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">Access from</span>
              <span className="text-base md:text-lg font-semibold text-foreground">Any browser</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Platforms;
