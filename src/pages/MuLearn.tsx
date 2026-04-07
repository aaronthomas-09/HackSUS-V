import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Zap, Trophy, CreditCard, Sparkles, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const MuLearn = () => {
    useEffect(() => {
        window.scrollTo(0, 0);

        // Load KonfHub widget script into the dedicated container
        const container = document.getElementById("konfhub-widget-container");
        if (container && !container.querySelector('script')) {
            const script = document.createElement("script");
            script.src = "https://widget.konfhub.com/widget.js";
            script.setAttribute("button_id", "btn_5729ccc796d9");
            script.async = true;
            container.appendChild(script);
        }
    }, []);

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } as any
    };

    return (
        <div className="min-h-screen bg-black text-foreground selection:bg-primary selection:text-primary-foreground overflow-x-hidden font-body flex flex-col relative">
            <Navbar />

            <main className="relative pt-32 pb-40 flex-grow">
                {/* Decorative Background Elements */}
                <div className="fixed inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-purple-500/5 pointer-events-none" />
                <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[150px] animate-pulse" />
                <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/5 rounded-full blur-[150px] animate-pulse" />

                <div className="container px-6 mx-auto relative z-10">
                    {/* Back Button */}
                    <motion.div {...fadeInUp} className="mb-12">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-all duration-300 group"
                        >
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="font-mono text-sm tracking-[0.2em] uppercase">Back to Hub</span>
                        </Link>
                    </motion.div>

                    {/* Hero Section */}
                    <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="mb-8 p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full"
                        >
                            <div className="flex items-center gap-3 px-4 py-2">
                                <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                                <span className="font-mono text-xs text-primary tracking-[0.3em] font-bold uppercase">Exclusive Access // MuLearn Community</span>
                            </div>
                        </motion.div>

                        <motion.h1
                            className="font-display text-5xl md:text-7xl lg:text-8xl leading-tight mb-6 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            HACKS'US X MULEARN
                        </motion.h1>

                        <motion.p
                            className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            Welcome, MuLearn members! We've prepared an exclusive registration portal for you to join HackS'US Edition 5. Use your special community code below to unlock exclusive benefits.
                        </motion.p>

                        {/* Coupon Code Section */}
                        <motion.div
                            className="w-full bg-charcoal/40 backdrop-blur-md border border-primary/30 rounded-2xl p-8 mb-12 relative overflow-hidden"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            style={{
                                boxShadow: "0 0 30px rgba(var(--primary), 0.1), inset 0 0 20px rgba(var(--primary), 0.05)"
                            }}
                        >
                            <div className="absolute top-0 right-0 p-4">
                                <Sparkles className="text-primary/40 animate-pulse" />
                            </div>

                            <h3 className="font-mono text-xs text-primary uppercase tracking-[0.4em] mb-4 flex items-center justify-center gap-2">
                                <CreditCard size={14} /> Application Promo Code
                            </h3>

                            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                                <div className="bg-black/60 border border-dashed border-primary/50 px-8 py-4 rounded-xl">
                                    <span className="font-display text-4xl md:text-5xl text-white tracking-[0.2em] font-black">
                                        MULEARN5
                                    </span>
                                </div>
                                <div className="text-left max-w-xs">
                                    <p className="text-sm text-white font-medium mb-1">How to use:</p>
                                    <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1">
                                        <li>Click the registration button below</li>
                                        <li>Select your tickets</li>
                                        <li>Enter <span className="text-primary font-bold">MULEARN5</span> at checkout</li>
                                        <li>Complete your registration</li>
                                    </ul>
                                </div>
                            </div>
                        </motion.div>

                        {/* Registration Widget Trigger */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                            className="relative z-20"
                        >
                            <div
                                id="konfhub-widget-container"
                                className="scale-125 transform transition-transform hover:scale-130 duration-300 min-h-[50px]"
                            />
                            <p className="mt-8 text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em]">
                                Registration handled by KonfHub Secure Systems
                            </p>
                        </motion.div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
};

export default MuLearn;
