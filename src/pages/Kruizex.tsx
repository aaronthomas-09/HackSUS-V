import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Users, Calendar, Trophy, MapPin, Zap, Info, Ship } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Kruizex = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } as any
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="min-h-screen bg-black text-foreground selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
            <Navbar />

            <main className="relative z-10">
                {/* Hero Wrapper with Video Background */}
                <div className="relative min-h-[90vh] flex flex-col pt-32 pb-24 overflow-hidden">
                    {/* Background Video - Localized to Hero */}
                    <div className="absolute inset-0 z-0">
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover opacity-60 brightness-[0.7] saturate-[0.9]"
                        >
                            <source src="/videos/water-metro.mp4" type="video/mp4" />
                        </video>

                        {/* Overlays for Hero area only */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
                        <div className="absolute inset-0 bg-black/20" />

                        {/* Animated Blobs localized to Hero */}
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.1, 0.15, 0.1]
                            }}
                            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[120px]"
                        />
                    </div>

                    <div className="container px-6 mx-auto relative z-10">
                        {/* Back button */}
                        <motion.div {...fadeInUp}>
                            <Link
                                to="/"
                                className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-all duration-300 group mb-12"
                            >
                                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                                <span className="font-mono text-sm tracking-wider uppercase">Back to Base</span>
                            </Link>
                        </motion.div>

                        {/* Hero Section Content */}
                        <div className="relative mb-8">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className="inline-block px-4 py-1.5 border border-blue-500/30 bg-blue-500/5 rounded-full mb-6 backdrop-blur-sm"
                            >
                                <span className="font-mono text-xs text-blue-400 tracking-[0.2em] uppercase">
                                    // Pre-Event Shortlisting
                                </span>
                            </motion.div>

                            <div className="flex                                            X flex-col md:flex-row md:items-end justify-between gap-8 mb-8">
                                <div className="max-w-3xl">
                                    <motion.h1
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                        className="font-display text-7xl md:text-9xl tracking-tighter leading-none mb-4 bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent [text-shadow:0_0_30px_rgba(255,255,255,0.2)]"
                                    >
                                        KRUIZE X
                                    </motion.h1>
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.8, delay: 0.2 }}
                                        className="text-xl md:text-2xl text-white/90 max-w-2xl font-body leading-relaxed drop-shadow-lg"
                                    >
                                        A first-of-its-kind Problathon as a <span className="text-red-600 font-semibold italic">Pre-Event</span> to <span className="text-red-600 font-semibold italic">HackS'US Edition V</span> happening onboard the <span className="text-blue-400 font-semibold italic">Kochi Water Metro</span>. Solve real-world urban transit challenges where they happen.
                                    </motion.p>
                                </div>

                                <div className="flex flex-col gap-6 md:items-end">
                                    {/* Prize Pool Section */}
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.8, delay: 0.3 }}
                                        className="flex flex-col items-start md:items-end gap-4 border-l md:border-l-0 md:border-r border-blue-500/40 pl-6 md:pl-14 pr-8 py-6 bg-blue-500/10 backdrop-blur-md rounded-r-none md:rounded-l-none"
                                    >
                                        <span className="font-mono text-sm text-blue-300 uppercase tracking-widest">Prize Pool</span>
                                        <span className="font-display text-5xl md:text-6xl text-blue-300 tracking-tight uppercase [text-shadow:0_0_15px_rgba(96,165,250,0.4)]">₹5,000</span>
                                        <span className="font-mono text-xs text-blue-200/60 italic">Total Competition Fund</span>
                                    </motion.div>

                                    {/* Event Date Section */}
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.8, delay: 0.4 }}
                                        className="flex flex-col items-start md:items-end gap-2 border-l md:border-l-0 md:border-r border-blue-500/40 pl-6 md:pr-6 py-2 bg-black/20 backdrop-blur-md rounded-r-none md:rounded-l-none"
                                    >
                                        <span className="font-mono text-sm text-white/70 uppercase">Event Date</span>
                                        <span className="font-display text-4xl text-primary tracking-tight uppercase [text-shadow:0_0_20px_rgba(231,24,24,0.4)]">FEB 19</span>
                                        <span className="font-mono text-xs text-blue-300 font-bold uppercase">Location: Water Metro, High Court / Kochi</span>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Partnerships */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                                className="flex flex-wrap items-center gap-8 pt-8 border-t border-white/10"
                            >
                                <div className="flex items-center gap-4 group">
                                    <span className="text-xs font-mono text-white/60 uppercase tracking-widest">In Partnership with</span>
                                    <div className="flex items-center gap-8 saturate-100 transition-all duration-500">
                                        <div className="flex items-center gap-2">
                                            <img src="/images/waterMetro.webp" alt="KMRL Water Metro" className="w-30 h-20" />
                                            {/* <span className="font-display text-xl tracking-tight text-white">KMRL</span> */}
                                        </div>
                                        {/*
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center font-bold text-white text-[10px] shadow-lg shadow-red-600/20">RB</div>
                                            <span className="font-display text-xl tracking-tight text-white italic">Red Bull</span>
                                        </div>
                                        */}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 group">
                                    <span className="text-xs font-mono text-white/60 uppercase tracking-widest">Sponsored By</span>
                                    <div className="flex items-center gap-8 saturate-100 transition-all duration-500">
                                        <div className="flex items-center gap-2">
                                            <img src="/images/cachet_kruizeX.webp" alt="Cacheet Sponsorship" className="w-32 h-20 object-contain" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                        </div>
                    </div>
                </div>

                {/* Main Content Area (Rest of the page) */}
                <div className="container px-6 mx-auto relative z-10 -mt-8">
                    {/* Stats/Quick Info Grid */}
                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-24"
                    >
                        {[
                            { icon: Users, label: "Team Size", value: "3 - 4 Members" },
                            { icon: Trophy, label: "Shortlisted Teams", value: "8 Finalists" },
                            { icon: Zap, label: "Event Type", value: "Problathon Onboard" },
                            { icon: Calendar, label: "Online Selection", value: "Feb 14th - 17th" }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                variants={fadeInUp}
                                className="group p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-blue-500/[0.03] hover:border-blue-500/20 transition-all duration-500"
                            >
                                <stat.icon className="w-5 h-5 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
                                <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1">{stat.label}</p>
                                <p className="text-lg font-display text-foreground tracking-tight">{stat.value}</p>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Problem Statement Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-24">
                        <div className="lg:col-span-3 space-y-12">
                            <motion.section
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <h2 className="font-display text-4xl uppercase tracking-tight">The Challenge</h2>
                                    <div className="h-px flex-1 bg-gradient-to-r from-blue-500/50 to-transparent"></div>
                                </div>
                                <div className="space-y-6 text-muted-foreground leading-relaxed text-lg">
                                    <p>
                                        In collaboration with <span className="text-foreground font-semibold">Kochi Water Metro</span>, KRUIZE<span className="ml-1">X</span> tasks participants to identify and solve critical bottlenecks in Kochi's public transport ecosystem.
                                    </p>
                                    <p>
                                        The mission is simple yet profound: <span className="text-blue-400 underline decoration-blue-500/30 underline-offset-4 font-medium italic">How can we increase the adoption of public transport like the Metro and Water Metro?</span>
                                    </p>
                                    <ul className="space-y-4 pt-4">
                                        {[
                                            "Identify user pain points in first and last-mile connectivity.",
                                            "Propose digital or systemic solutions to reduce operational losses.",
                                            "Enhance the 'Kochi Metro' user experience via tech or social innovation.",
                                            "Develop strategies to shift commuters from private vehicles to urban rail/water transport."
                                        ].map((item, i) => (
                                            <motion.li
                                                key={i}
                                                initial={{ opacity: 0, x: -10 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: i * 0.1 }}
                                                className="flex gap-4 group"
                                            >
                                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:scale-125 group-hover:bg-primary transition-all duration-300"></div>
                                                <span className="group-hover:text-foreground transition-colors duration-300">{item}</span>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.section>

                            <motion.section
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <h2 className="font-display text-4xl uppercase tracking-tight">Event Flow</h2>
                                    <div className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent"></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <motion.div
                                        whileHover={{ y: -5 }}
                                        className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl transition-colors duration-300 hover:bg-white/[0.04]"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center font-mono text-blue-400 mb-4 italic">01</div>
                                        <h3 className="font-display text-xl mb-2">Online Shortlisting</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            Submit your abstract and basic prototype/plan online. Our jury will select the top 8 teams to board the vessel.
                                        </p>
                                    </motion.div>
                                    <motion.div
                                        whileHover={{ y: -5 }}
                                        className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl relative overflow-hidden group"
                                    >
                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                            <MapPin className="w-12 h-12" />
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center font-mono text-blue-400 mb-4 italic">02</div>
                                        <h3 className="font-display text-xl mb-2">Finale Onboard</h3>
                                        <p className="text-sm text-blue-100/70 leading-relaxed font-medium">
                                            Finalist teams will present their solutions to KMRL officials while cruising on the Water Metro from the High Court Station on Feb 19.
                                        </p>
                                    </motion.div>
                                </div>
                            </motion.section>
                        </div>

                        {/* Call to Action Sidebar */}
                        <div className="lg:col-span-2">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                                className="sticky top-32 p-1 bg-gradient-to-b from-blue-500/20 to-transparent rounded-[2.5rem]"
                            >
                                <div className="bg-black/90 backdrop-blur-2xl border border-white/10 p-8 md:p-10 rounded-[2.4rem] space-y-8">
                                    <div className="space-y-2">
                                        <h3 className="font-display text-4xl tracking-tight uppercase">Ready to board?</h3>
                                        <p className="text-muted-foreground text-sm uppercase font-mono tracking-widest">// Registration Closed</p>
                                    </div>

                                    <div className="space-y-4">
                                        <motion.a
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            href="#"
                                            className="block w-full py-5 bg-blue-600 hover:bg-blue-500 text-white text-center font-display text-2xl tracking-[0.05em] uppercase rounded-2xl transition-all shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_50px_rgba(37,99,235,0.5)]"
                                        >
                                            Register Closed
                                        </motion.a>
                                    </div>

                                    <div className="pt-8 border-t border-white/5 space-y-6">
                                        <div className="flex gap-4">
                                            <div className="p-3 rounded-xl bg-white/5 h-fit text-blue-400">
                                                <Info size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-mono text-sm text-foreground mb-1 uppercase tracking-wider italic">Partner Perspective</h4>
                                                <p className="text-sm text-muted-foreground leading-relaxed italic">
                                                    "We are looking for practical, data-driven solutions that can be piloted in the real world." - KMRL Partner Note
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* FAQ Mockup */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="mb-24"
                    >
                        <div className="flex items-center gap-3 mb-10 justify-center">
                            <div className="h-px w-12 bg-blue-500/50"></div>
                            <h2 className="font-display text-4xl uppercase tracking-widest text-center">F.A.Q</h2>
                            <div className="h-px w-12 bg-blue-500/50"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 max-w-5xl mx-auto">
                            {[
                                { q: "What is registration fee?", a: "KRUIZE X is 49 INR per person" },
                                { q: "Who can participate?", a: "Teams of 3-4 students from any college in Kerala." },
                                { q: "Do we need a working prototype?", a: "No, Just present the problems and your ideas to solve them." },
                                { q: "What are the prizes?", a: "Cash prizes, and the chance to showcase to KMRL leadership." },
                                { q: "Where does the water metro start from?", a: "The offline round will start on the Kochi Water Metro from the High Court Station" }
                            ].map((faq, i) => (
                                <div key={i} className="space-y-2">
                                    <h4 className="font-mono text-blue-400 text-sm uppercase tracking-wide">// {faq.q}</h4>
                                    <p className="text-muted-foreground">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Contact Section */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="mb-24"
                    >
                        <div className="flex items-center gap-3 mb-10 justify-center">
                            <div className="h-px w-12 bg-blue-500/50"></div>
                            <h2 className="font-display text-4xl uppercase tracking-widest text-center">Contact</h2>
                            <div className="h-px w-12 bg-blue-500/50"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                            {[
                                {
                                    name: "Joshua Faithson Roy",
                                    role: "Event Coordinator",
                                    phone: "+91 99952 22119",
                                    phoneLink: "+91XXXXXXXXXX",
                                    email: "u2301119@rajagiri.edu.in",
                                },
                                {
                                    name: "Justin Joven",
                                    role: "Event Coordinator",
                                    phone: "+91 74285 19729",
                                    phoneLink: "+91XXXXXXXXXX",
                                    email: "justinjovenm@gmail.com",
                                },
                            ].map((contact, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.15 }}
                                    whileHover={{ y: -5 }}
                                    className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-blue-500/[0.03] hover:border-blue-500/20 transition-all duration-500"
                                >
                                    <p className="text-xs font-mono text-blue-400 uppercase tracking-wider mb-3">
                                        // {contact.role}
                                    </p>
                                    <h3 className="font-display text-2xl tracking-tight text-foreground mb-5">
                                        {contact.name}
                                    </h3>
                                    <div className="space-y-3">
                                        <a
                                            href={`tel:${contact.phoneLink}`}
                                            className="flex items-center gap-3 text-sm text-muted-foreground hover:text-blue-400 transition-colors group"
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:scale-125 transition-transform" />
                                            {contact.phone}
                                        </a>
                                        <a
                                            href={`mailto:${contact.email}`}
                                            className="flex items-center gap-3 text-sm text-muted-foreground hover:text-blue-400 transition-colors group break-all"
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:scale-125 transition-transform" />
                                            {contact.email}
                                        </a>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Kruizex;
