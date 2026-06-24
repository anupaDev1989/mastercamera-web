import React, { useState, useRef } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import Button from '../components/Button';
import Input from '../components/Input';

const Wishlist = () => {
    const [email, setEmail] = useState('');
    const [industry, setIndustry] = useState('');
    const [honeypot, setHoneypot] = useState('');
    const [turnstileToken, setTurnstileToken] = useState('');
    const [status, setStatus] = useState('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const lastSubmitTime = useRef(0);
    const turnstileRef = useRef(null);

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email) && email.length <= 254;
    };

    const sanitizeInput = (input) => {
        if (!input) return '';
        return input.trim().replace(/[<>]/g, '').replace(/javascript:/gi, '').slice(0, 500);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (!email) {
            setErrorMessage('Email is required');
            return;
        }

        if (!isValidEmail(email)) {
            setErrorMessage('Please enter a valid email address');
            return;
        }

        if (!turnstileToken) {
            setErrorMessage('Please complete the security check');
            return;
        }

        const now = Date.now();
        if (now - lastSubmitTime.current < 30000) {
            const remaining = Math.ceil((30000 - (now - lastSubmitTime.current)) / 1000);
            setErrorMessage(`Please wait ${remaining} seconds before submitting again`);
            return;
        }

        setStatus('loading');

        try {
            const response = await fetch('/api/wishlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email.toLowerCase().trim(),
                    industry: sanitizeInput(industry),
                    honeypot,
                    turnstileToken,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus('success');
                setEmail('');
                setIndustry('');
                setHoneypot('');
                setTurnstileToken('');
                lastSubmitTime.current = now;
                if (turnstileRef.current) turnstileRef.current.reset();
            } else {
                setStatus('error');
                if (response.status === 429 && data.retryAfter) {
                    setErrorMessage(`Too many requests. Please try again in ${Math.ceil(data.retryAfter / 60)} minutes.`);
                } else {
                    setErrorMessage(data.error || 'Something went wrong. Please try again.');
                }
            }
        } catch {
            setStatus('error');
            setErrorMessage('Network error. Please check your connection and try again.');
            if (turnstileRef.current) turnstileRef.current.reset();
            setTurnstileToken('');
        }
    };

    return (
        <section id="wishlist" className="py-24 md:py-32 mt-8 md:mt-12">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="mb-4 font-heading text-3xl font-bold text-foreground md:text-4xl">Get Early Access</h2>
                    <p className="mb-8 text-lg text-muted-foreground">
                        Master Camera is launching on the App Store soon. Join the waitlist to be among the first to try it and get notified the moment it's available.
                        Early access members will receive special launch discounts and direct input on features.
                    </p>

                    <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 shadow-lg">
                        {status === 'success' ? (
                            <div className="text-center animate-fade-in">
                                <h3 className="mb-2 text-xl font-semibold text-foreground">You're on the list! 🎉</h3>
                                <p className="mb-6 text-muted-foreground">Thanks for your interest. We'll let you know as soon as Master Camera is available.</p>
                                <Button variant="secondary" onClick={() => setStatus('idle')} className="w-full">
                                    Add another email
                                </Button>
                            </div>
                        ) : (
                            <form className="space-y-4" onSubmit={handleSubmit}>
                                {/* Honeypot — hidden from users, visible to bots */}
                                <div style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
                                    <input
                                        type="text"
                                        name="website"
                                        tabIndex="-1"
                                        autoComplete="off"
                                        value={honeypot}
                                        onChange={(e) => setHoneypot(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <Input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        maxLength={254}
                                        className="w-full"
                                        aria-label="Email address"
                                    />
                                    <Input
                                        type="text"
                                        placeholder="Industry / Profession (Optional)"
                                        value={industry}
                                        onChange={(e) => setIndustry(e.target.value)}
                                        maxLength={500}
                                        className="w-full"
                                        aria-label="Industry or profession"
                                    />
                                </div>

                                <div className="flex justify-center">
                                    <Turnstile
                                        ref={turnstileRef}
                                        siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
                                        onSuccess={(token) => {
                                            setTurnstileToken(token);
                                            setErrorMessage('');
                                        }}
                                        onError={() => {
                                            setTurnstileToken('');
                                            setErrorMessage('Security check failed. Please try again.');
                                        }}
                                        onExpire={() => {
                                            setTurnstileToken('');
                                            setErrorMessage('Security check expired. Please verify again.');
                                        }}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="w-full"
                                    disabled={status === 'loading'}
                                >
                                    {status === 'loading' ? 'Joining...' : 'Join the waitlist'}
                                </Button>
                                {errorMessage && (
                                    <p className="text-sm text-destructive" role="alert">{errorMessage}</p>
                                )}
                            </form>
                        )}
                    </div>
                    <p className="mt-6 text-sm text-muted-foreground">
                        No spam, unsubscribe anytime.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Wishlist;
