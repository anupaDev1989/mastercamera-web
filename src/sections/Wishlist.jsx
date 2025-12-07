import React, { useState, useRef } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import Button from '../components/Button';
import Input from '../components/Input';

const Wishlist = () => {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [teamSize, setTeamSize] = useState('');
    const [useCase, setUseCase] = useState('');
    const [honeypot, setHoneypot] = useState(''); // Bot detection
    const [turnstileToken, setTurnstileToken] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [errorMessage, setErrorMessage] = useState('');
    const lastSubmitTime = useRef(0);
    const turnstileRef = useRef(null);

    // Client-side email validation
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email) && email.length <= 254;
    };

    // Client-side input sanitization
    const sanitizeInput = (input) => {
        if (!input) return '';
        return input
            .trim()
            .replace(/[<>]/g, '')
            .replace(/javascript:/gi, '')
            .slice(0, 500); // Max length
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        // Client-side validation
        if (!email) {
            setErrorMessage('Email is required');
            return;
        }

        if (!isValidEmail(email)) {
            setErrorMessage('Please enter a valid email address');
            return;
        }

        // Validate Turnstile token
        if (!turnstileToken) {
            setErrorMessage('Please complete the security check');
            return;
        }

        // Check length limits
        if (email.length > 254 || role.length > 500 || teamSize.length > 500 || useCase.length > 500) {
            setErrorMessage('Input too long. Please use shorter text.');
            return;
        }

        // Submission throttling - prevent rapid repeated submissions
        const now = Date.now();
        const timeSinceLastSubmit = now - lastSubmitTime.current;
        const THROTTLE_MS = 30000; // 30 seconds

        if (timeSinceLastSubmit < THROTTLE_MS) {
            const remainingSeconds = Math.ceil((THROTTLE_MS - timeSinceLastSubmit) / 1000);
            setErrorMessage(`Please wait ${remainingSeconds} seconds before submitting again`);
            return;
        }

        setStatus('loading');

        try {
            const response = await fetch('/api/wishlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email.toLowerCase().trim(),
                    role: sanitizeInput(role),
                    teamSize: sanitizeInput(teamSize),
                    useCase: sanitizeInput(useCase),
                    honeypot: honeypot, // Include honeypot field
                    turnstileToken: turnstileToken // Include Turnstile token
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus('success');
                setEmail('');
                setRole('');
                setTeamSize('');
                setUseCase('');
                setHoneypot('');
                setTurnstileToken('');
                lastSubmitTime.current = now;
                // Reset Turnstile widget
                if (turnstileRef.current) {
                    turnstileRef.current.reset();
                }
            } else {
                setStatus('error');
                // Display specific error from API
                setErrorMessage(data.error || 'Something went wrong. Please try again.');

                // If rate limited, show retry time
                if (response.status === 429 && data.retryAfter) {
                    setErrorMessage(`Too many requests. Please try again in ${Math.ceil(data.retryAfter / 60)} minutes.`);
                }
            }
        } catch (error) {
            console.error('Error submitting wishlist:', error);
            setStatus('error');
            setErrorMessage('Network error. Please check your connection and try again.');
            // Reset Turnstile on error
            if (turnstileRef.current) {
                turnstileRef.current.reset();
            }
            setTurnstileToken('');
        }
    };

    return (
        <section id="wishlist" className="py-24 md:py-32 mt-16 md:mt-24">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="mb-4 font-heading text-3xl font-bold text-foreground md:text-4xl">Get Early Access</h2>
                    <p className="mb-8 text-lg text-muted-foreground">
                        Join the wishlist to be the first to know when RiGG launches.
                        Help us shape the roadmap and get exclusive updates.
                    </p>

                    <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 shadow-lg">
                        {status === 'success' ? (
                            <div className="text-center animate-fade-in">
                                <h3 className="mb-2 text-xl font-semibold text-foreground">You're on the list! 🎉</h3>
                                <p className="mb-6 text-muted-foreground">Thanks for your interest. We'll be in touch soon.</p>
                                <Button variant="secondary" onClick={() => setStatus('idle')} className="w-full">
                                    Add another email
                                </Button>
                            </div>
                        ) : (
                            <form className="space-y-4" onSubmit={handleSubmit}>
                                {/* Honeypot field - hidden from users, visible to bots */}
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
                                        placeholder="Your Role (Optional)"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        maxLength={500}
                                        className="w-full"
                                        aria-label="Your role"
                                    />
                                    <Input
                                        type="text"
                                        placeholder="Team Size (Optional)"
                                        value={teamSize}
                                        onChange={(e) => setTeamSize(e.target.value)}
                                        maxLength={500}
                                        className="w-full"
                                        aria-label="Team size"
                                    />
                                    <Input
                                        type="text"
                                        placeholder="Primary Use Case (Optional)"
                                        value={useCase}
                                        onChange={(e) => setUseCase(e.target.value)}
                                        maxLength={500}
                                        className="w-full"
                                        aria-label="Primary use case"
                                    />
                                </div>
                                
                                {/* Cloudflare Turnstile Widget */}
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
                                    {status === 'loading' ? 'Joining...' : 'Join the Wishlist'}
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
