import { useState, useEffect, useRef } from "react";
import { ArrowUpRight, Menu, X, Github, Linkedin, Mail, Send, ChevronDown } from "lucide-react";
import emailjs from "@emailjs/browser";
import profilePhoto from "../imports/photo.jpeg";
import resumePdf from "../../resume.pdf";

const NAV_LINKS = ["About", "Projects", "Learning", "Contact"];

const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/devutkarshh", icon: Github },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/devutkarshmishra/", icon: Linkedin },
  { label: "LeetCode", href: "https://leetcode.com/devutkarshh" },
  { label: "Instagram", href: "https://www.instagram.com/utkarshm14/" },
  { label: "Email", href: "mailto:utkarshm848@gmail.com", icon: Mail },
];

const PROJECTS = [
  {
    id: 1,
    title: "EcoByte",
    category: "AI / ML + Web App",
    year: "2025",
    description: "A centralized e-waste management platform for tracking, recycling, and intelligent analytics with machine learning-powered price prediction.",
    tags: ["Python", "Flask", "SQLite", "Scikit-Learn", "Chart.js"],
    repoUrl: "https://github.com/devutkarshh/eco-byte",
    liveUrl: "https://eco-byte.onrender.com/",
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=600&fit=crop&auto=format",
    featured: true,
  },
  {
    id: 2,
    title: "DrawSync",
    category: "Full-Stack Collaboration",
    year: "2025",
    description: "A collaborative whiteboard application with real-time synchronization over WebSockets for multi-user drawing and editing.",
    tags: ["Next.js", "TypeScript", "TurboRepo", "WebSockets"],
    repoUrl: "https://github.com/devutkarshh/DrawSync",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop&auto=format",
    featured: false,
  },
  {
    id: 3,
    title: "Battery RUL Prediction",
    category: "Machine Learning",
    year: "2024",
    description: "A machine learning pipeline for predicting the remaining useful life of lithium-ion batteries using NASA battery datasets.",
    tags: ["Python", "Scikit-Learn", "NumPy", "Pandas"],
    repoUrl: "https://github.com/devutkarshh/battery-rul-prediction",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop&auto=format",
    featured: false,
  },
  {
    id: 4,
    title: "MetaCausalML",
    category: "Research & ML",
    year: "2024",
    description: "A project exploring causal inference and meta-learning techniques for predictive modeling and experimentation.",
    tags: ["Python", "Scikit-Learn", "Pandas", "Causal Inference"],
    repoUrl: "https://github.com/devutkarshh/MetaCausalML",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop&auto=format",
    featured: false,
  },
  {
    id: 5,
    title: "Personal Budget Tracker",
    category: "Productivity Web App",
    year: "2025",
    description: "A personal finance web app for expense tracking, budget management, and interactive visualizations.",
    tags: ["Next.js", "JavaScript", "Chart.js"],
    repoUrl: "https://github.com/devutkarshh/PersonalBudgetTracker",
    liveUrl: "https://personalbudgettracker.vercel.app/",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop&auto=format",
    featured: false,
  },
];

const SKILLS = [
  { label: "Java Development", items: "Object-oriented programming, backend development, and scalable applications" },
  { label: "Backend Engineering", items: "REST APIs, authentication, databases, and system architecture" },
  { label: "AI & Machine Learning", items: "Predictive analytics, computer vision, and intelligent applications" },
  { label: "Full-Stack Development", items: "React, Next.js, Flask, and Node.js" },
];

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [submissionStatus, setSubmissionStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState("");
  const heroRef = useRef<HTMLDivElement>(null);

  const openProjectLink = (project: { repoUrl: string; liveUrl?: string }) => {
    const targetUrl = project.liveUrl ?? project.repoUrl;
    window.open(targetUrl, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const categories = ["All", ...Array.from(new Set(PROJECTS.map((p) => p.category)))];
  const filtered = activeFilter === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === activeFilter);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;

    if (!serviceId || !templateId || !publicKey) {
      setSubmissionStatus("error");
      setSubmitError("EmailJS is not configured yet. Add the EmailJS env variables to enable sending.");
      return;
    }

    setSubmissionStatus("sending");
    setSubmitError("");

    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: formState.name,
          from_email: formState.email,
          reply_to: formState.email,
          message: formState.message,
          to_name: "Utkarsh Mishra",
        },
        { publicKey },
      );

      setSubmissionStatus("success");
      setFormState({ name: "", email: "", message: "" });
    } catch {
      setSubmissionStatus("error");
      setSubmitError("Message could not be sent. Please try again or email me directly.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden" style={{ fontFamily: "'Figtree', sans-serif" }}>

      {/* NAV */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-5 transition-all duration-300"
        style={{ background: scrolled ? "rgba(34,37,26,0.94)" : "transparent", backdropFilter: scrolled ? "blur(12px)" : "none" }}
      >
        <button
          className="text-foreground uppercase tracking-[0.18em] text-sm font-bold hover:text-primary transition-colors"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.2em" }}
          onClick={() => scrollTo("hero")}
        >
          Utkarsh Mishra
        </button>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <button
              key={link}
              onClick={() => scrollTo(link.toLowerCase())}
              className="text-foreground/70 hover:text-primary transition-colors text-sm uppercase tracking-widest"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.18em" }}
            >
              {link}
            </button>
          ))}
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); scrollTo("contact"); }}
            className="bg-primary text-primary-foreground px-5 py-2 text-sm font-bold uppercase tracking-widest transition-all hover:bg-foreground hover:text-background"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.18em" }}
          >
            Connect
          </a>
        </div>

        <button
          className="md:hidden text-foreground p-2 hover:text-primary transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* MOBILE MENU */}
      <div
        className={`fixed inset-0 z-40 bg-background flex flex-col justify-center items-center gap-10 transition-all duration-500 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {NAV_LINKS.map((link) => (
          <button
            key={link}
            onClick={() => scrollTo(link.toLowerCase())}
            className="text-foreground text-6xl font-black uppercase hover:text-primary transition-colors"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            {link}
          </button>
        ))}
      </div>

      {/* HERO */}
      <section id="hero" ref={heroRef} className="min-h-screen relative flex flex-col justify-end pb-16 px-6 md:px-10 pt-32">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full opacity-[0.04] animate-[centerOrb_24s_ease-in-out_infinite]"
            style={{ background: "radial-gradient(circle, #c8f03a 0%, transparent 70%)" }}
          />
          <div
            className="absolute -top-24 right-[-6rem] w-[20rem] h-[20rem] rounded-full blur-3xl opacity-[0.05] animate-[ambientOrb_28s_ease-in-out_infinite]"
            style={{ background: "radial-gradient(circle, rgba(200,240,58,0.7) 0%, transparent 72%)", animationDelay: "-8s" }}
          />
        </div>

        <div className="relative">
          <p
            className="text-xs uppercase tracking-[0.35em] text-foreground/50 mb-8 animate-[riseFade_900ms_cubic-bezier(0.22,1,0.36,1)_both]"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", animationDelay: "80ms" }}
          >
            Java Developer • Backend Developer • AI/ML Developer
          </p>

          <h1
            className="text-[13vw] md:text-[11vw] leading-[0.88] font-black uppercase mb-0"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            <span className="block text-foreground animate-[riseFade_900ms_cubic-bezier(0.22,1,0.36,1)_both]" style={{ animationDelay: "140ms" }}>Java</span>
            <span className="block text-primary animate-[riseFade_900ms_cubic-bezier(0.22,1,0.36,1)_both]" style={{ animationDelay: "220ms" }}>Backend</span>
            <span className="block text-foreground animate-[riseFade_900ms_cubic-bezier(0.22,1,0.36,1)_both]" style={{ animationDelay: "300ms" }}>AI / ML</span>
            <span className="block text-foreground/20 animate-[riseFade_900ms_cubic-bezier(0.22,1,0.36,1)_both]" style={{ animationDelay: "380ms" }}>Developer</span>
          </h1>

          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mt-12 gap-8">
            <p className="max-w-sm text-foreground/60 text-base leading-relaxed animate-[riseFade_900ms_cubic-bezier(0.22,1,0.36,1)_both]" style={{ fontFamily: "'DM Serif Display', serif", animationDelay: "460ms" }}>
              <em>Computer Science (AI &amp; ML) student building backend systems, full-stack applications, and AI-powered solutions from Kolkata, India.</em>
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => scrollTo("projects")}
                className="group flex items-center gap-3 bg-primary text-primary-foreground px-6 py-3 font-bold uppercase tracking-widest text-sm hover:bg-foreground hover:text-background transition-all duration-300 hover:-translate-y-0.5 animate-[riseFade_900ms_cubic-bezier(0.22,1,0.36,1)_both]"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", animationDelay: "540ms" }}
              >
                View Projects
                <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
              <button
                onClick={() => scrollTo("contact")}
                className="border border-foreground/20 text-foreground px-6 py-3 font-bold uppercase tracking-widest text-sm hover:border-primary hover:text-primary transition-all duration-300 hover:-translate-y-0.5 animate-[riseFade_900ms_cubic-bezier(0.22,1,0.36,1)_both]"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", animationDelay: "620ms" }}
              >
                Let&apos;s Connect
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={() => scrollTo("about")}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-foreground/30 hover:text-primary transition-colors animate-[floatY_4.5s_ease-in-out_infinite]"
        >
          <ChevronDown size={24} />
        </button>
      </section>

      {/* TICKER */}
      <div className="bg-primary py-3 overflow-hidden whitespace-nowrap">
        <div
          className="inline-flex gap-12 text-primary-foreground uppercase text-sm font-black tracking-widest"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", animation: "ticker 18s linear infinite" }}
        >
          {Array(8).fill(null).map((_, i) => (
            <span key={i} className="inline-flex items-center gap-12">
              <span>Java Development</span>
              <span className="opacity-40">✦</span>
              <span>Backend Engineering</span>
              <span className="opacity-40">✦</span>
              <span>AI / Machine Learning</span>
              <span className="opacity-40">✦</span>
              <span>Full-Stack Development</span>
              <span className="opacity-40">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ABOUT */}
      <section id="about" className="py-32 px-6 md:px-10 animate-[softReveal_900ms_cubic-bezier(0.22,1,0.36,1)_both]" style={{ background: "#f0ebe0", color: "#1a1c10", animationDelay: "40ms" }}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          {/* Left: image + label */}
          <div className="relative">
            <p
              className="text-xs uppercase tracking-[0.3em] mb-4 opacity-40 animate-[riseFade_900ms_cubic-bezier(0.22,1,0.36,1)_both]"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#1a1c10", animationDelay: "80ms" }}
            >
              Kolkata, India · 2026
            </p>
            <div className="relative overflow-hidden animate-[riseFade_1000ms_cubic-bezier(0.22,1,0.36,1)_both]" style={{ aspectRatio: "3/4", animationDelay: "140ms" }}>
              <img
                src={profilePhoto}
                alt="Utkarsh Mishra, Java Developer"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.03]"
              />
              <div
                className="absolute bottom-0 left-0 right-0 h-1/3"
                style={{ background: "linear-gradient(to top, #f0ebe0, transparent)" }}
              />
            </div>
            {/* floating stat */}
            <div
              className="absolute -bottom-6 -right-6 md:-right-10 bg-[#22251a] text-[#f0ebe0] px-8 py-6"
            >
              <p className="text-5xl font-black animate-[softPulse_6s_ease-in-out_infinite]" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#c8f03a" }}>5</p>
              <p className="text-xs uppercase tracking-widest mt-1 opacity-60" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Featured Projects</p>
            </div>
          </div>

          {/* Right: bio + skills */}
          <div className="pt-8 md:pt-16 animate-[riseFade_1000ms_cubic-bezier(0.22,1,0.36,1)_both]" style={{ animationDelay: "180ms" }}>
            <p className="text-xs uppercase tracking-[0.3em] mb-6 opacity-40" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              About Me
            </p>
            <h2
              className="text-5xl md:text-6xl font-black uppercase leading-none mb-8"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              Building With<br />
              <span style={{ color: "#22251a", WebkitTextStroke: "2px #22251a" }}>Purpose.</span>
            </h2>
            <blockquote
              className="text-2xl leading-relaxed mb-8 italic"
              style={{ fontFamily: "'DM Serif Display', serif", color: "#1a1c10" }}
            >
              "Turning ideas into practical software through Java, backend systems, and AI/ML."
            </blockquote>
            <p className="text-base leading-relaxed mb-4 opacity-70">
              I'm Utkarsh Mishra, an AI &amp; ML engineer passionate about building backend systems, full-stack applications, and AI-powered solutions.
            </p>
            <p className="text-base leading-relaxed mb-12 opacity-70">
              I enjoy transforming ideas into practical software, solving real-world problems through modern software engineering, machine learning, and scalable backend development while continuously learning new technologies.
            </p>

            {/* Skills grid */}
            <div className="grid grid-cols-2 gap-px border border-[#1a1c10]/10" style={{ background: "rgba(26,28,16,0.08)" }}>
              {SKILLS.map((skill) => (
                <div key={skill.label} className="p-5 transition-transform duration-300 hover:-translate-y-0.5" style={{ background: "#f0ebe0" }}>
                  <p className="text-xs uppercase tracking-widest mb-2 opacity-40" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{skill.label}</p>
                  <p className="text-sm leading-relaxed opacity-80">{skill.items}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="py-32 px-6 md:px-10 bg-background animate-[softReveal_900ms_cubic-bezier(0.22,1,0.36,1)_both]" style={{ animationDelay: "80ms" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div className="animate-[riseFade_900ms_cubic-bezier(0.22,1,0.36,1)_both]" style={{ animationDelay: "80ms" }}>
              <p className="text-xs uppercase tracking-[0.3em] text-foreground/40 mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                Featured Projects
              </p>
              <h2
                className="text-6xl md:text-7xl font-black uppercase leading-none"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                Project<br />
                <span className="text-primary">Highlights</span><br />
                &amp; Work.
              </h2>
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap gap-2 animate-[riseFade_900ms_cubic-bezier(0.22,1,0.36,1)_both]" style={{ animationDelay: "140ms" }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-4 py-1.5 text-xs uppercase tracking-widest border transition-all ${
                    activeFilter === cat
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-foreground/20 text-foreground/60 hover:border-primary hover:text-primary"
                  }`}
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Featured project (first one) */}
          {activeFilter === "All" && (
            <div className="mb-4 group cursor-pointer animate-[riseFade_1000ms_cubic-bezier(0.22,1,0.36,1)_both]" style={{ marginBottom: "4px", animationDelay: "180ms" }}>
              <div className="relative overflow-hidden animate-[softReveal_1000ms_cubic-bezier(0.22,1,0.36,1)_both]" style={{ aspectRatio: "16/7", animationDelay: "160ms" }}>
                <img
                  src={PROJECTS[0].image}
                  alt={PROJECTS[0].title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-background/60 group-hover:bg-background/40 transition-colors duration-300" />
                <div className="absolute inset-0 p-10 flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs uppercase tracking-widest text-primary font-bold" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                            Featured · {PROJECTS[0].year}
                      </span>
                      <h3
                        className="text-5xl md:text-7xl font-black uppercase mt-2 leading-none text-foreground"
                        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                      >
                        {PROJECTS[0].title}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => openProjectLink(PROJECTS[0])}
                      className="bg-primary text-primary-foreground p-3 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label={`Open ${PROJECTS[0].liveUrl ? "live deployment" : "GitHub repository"} for ${PROJECTS[0].title}`}
                    >
                      <ArrowUpRight size={20} />
                    </button>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <p className="text-foreground/70 max-w-md">{PROJECTS[0].description}</p>
                    <div className="flex flex-col items-start gap-3">
                      <div className="flex gap-2 flex-wrap">
                        {PROJECTS[0].tags.map((tag) => (
                          <span
                            key={tag}
                            className="border border-foreground/20 px-3 py-1 text-xs uppercase tracking-wider text-foreground/60"
                            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <a
                          href={PROJECTS[0].repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs uppercase tracking-widest font-bold text-primary hover:text-foreground transition-colors"
                          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                        >
                          GitHub Repository
                        </a>
                        {PROJECTS[0].liveUrl && (
                          <a
                            href={PROJECTS[0].liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs uppercase tracking-widest font-bold text-primary hover:text-foreground transition-colors"
                            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                          >
                            Live Deployment
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Grid of remaining projects */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: "rgba(240,235,224,0.06)" }}>
            {(activeFilter === "All" ? filtered.slice(1) : filtered).map((project) => (
              <div
                key={project.id}
                className="group cursor-pointer relative overflow-hidden bg-card transition-transform duration-500 hover:-translate-y-1 animate-[softReveal_900ms_cubic-bezier(0.22,1,0.36,1)_both]"
                style={{ aspectRatio: "4/3" }}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-background/70 group-hover:bg-background/50 transition-colors duration-300" />
                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span
                      className="text-xs uppercase tracking-widest text-foreground/50"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    >
                      {project.category}
                    </span>
                    <span
                      className="text-xs text-foreground/30"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    >
                      {project.year}
                    </span>
                  </div>
                  <div>
                    <h3
                      className="text-3xl font-black uppercase mb-2 text-foreground group-hover:text-primary transition-colors"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    >
                      {project.title}
                    </h3>
                    <p className="text-foreground/60 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {project.description}
                    </p>
                    <div className="flex gap-2 flex-wrap mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-primary/20 text-primary px-2 py-0.5 text-xs uppercase tracking-wider"
                          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-3 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs uppercase tracking-widest font-bold text-primary hover:text-foreground transition-colors"
                        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                      >
                        GitHub Repository
                      </a>
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs uppercase tracking-widest font-bold text-primary hover:text-foreground transition-colors"
                          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                        >
                          Live Deployment
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => openProjectLink(project)}
                  className="absolute top-4 right-4 bg-primary text-primary-foreground p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  aria-label={`Open ${project.liveUrl ? "live deployment" : "GitHub repository"} for ${project.title}`}
                >
                  <ArrowUpRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTE BREAK */}
      <section className="py-24 px-6 md:px-10 overflow-hidden" style={{ background: "#f0ebe0", color: "#1a1c10" }}>
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-[10vw] font-black uppercase leading-none text-center"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            <span style={{ color: "#1a1c10" }}>Always</span>{" "}
            <span style={{ color: "#c8f03a", WebkitTextStroke: "2px #22251a" }}>Learning.</span>
          </h2>
          <h2
            className="text-[10vw] font-black uppercase leading-none text-center mt-[-0.1em]"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            <span style={{ color: "#22251a", opacity: 0.15 }}>Always</span>{" "}
            <span style={{ color: "#1a1c10" }}>Building.</span>
          </h2>
        </div>
      </section>

      {/* LEARNING */}
      <section id="learning" className="py-24 px-6 md:px-10 bg-background animate-[softReveal_900ms_cubic-bezier(0.22,1,0.36,1)_both]" style={{ animationDelay: "60ms" }}>
        <div className="max-w-7xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-foreground/40 mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Currently Learning
          </p>
          <div className="border border-foreground/10 bg-card p-8 md:p-10 animate-[softReveal_1000ms_cubic-bezier(0.22,1,0.36,1)_both]" style={{ animationDelay: "140ms" }}>
            <pre className="overflow-x-auto text-sm md:text-base leading-relaxed whitespace-pre-wrap text-foreground/80" style={{ fontFamily: "'Fira Code', monospace" }}>{`┌─────────────────────────────────────────┐
│ 🚀 Current Learning Journey             │
├─────────────────────────────────────────┤
│ ✓ Java Backend Development              │
│ ✓ AI & Machine Learning                 │
│ ✓ Full-Stack Development                │
│ ✓ System Design                         │
│ ✓ Data Structures & Algorithms          │
│ ✓ Open Source Contributions             │
└─────────────────────────────────────────┘`}</pre>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-32 px-6 md:px-10 bg-background animate-[softReveal_900ms_cubic-bezier(0.22,1,0.36,1)_both]" style={{ animationDelay: "100ms" }}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <div>
            <p
              className="text-xs uppercase tracking-[0.3em] text-foreground/40 mb-6"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              Connect With Me
            </p>
            <h2
              className="text-6xl md:text-7xl font-black uppercase leading-none mb-10"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              Build Something<br />
              <span className="text-primary">Impactful</span><br />
              Together.
            </h2>
            <p className="text-foreground/60 mb-12 max-w-xs leading-relaxed">
              Open to collaborating on Java development, AI &amp; machine learning, full-stack applications, backend engineering, and open source.
            </p>

            <div className="space-y-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-foreground/40 mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Email</p>
                <a href="mailto:utkarshm848@gmail.com" className="text-foreground hover:text-primary transition-all duration-300 hover:translate-x-0.5">utkarshm848@gmail.com</a>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-foreground/40 mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Based In</p>
                <p className="text-foreground">Kolkata, India · Available Globally</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-12">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer" : undefined}
                  className="inline-flex items-center gap-3 border border-foreground/20 px-4 py-3 text-foreground/70 hover:border-primary hover:text-primary transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
                  aria-label={label}
                >
                  {Icon ? <Icon size={18} /> : <span className="text-xs uppercase tracking-widest font-bold">{label.slice(0, 2)}</span>}
                  <span className="text-xs uppercase tracking-widest font-bold" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{label}</span>
                </a>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              <a
                href={resumePdf}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 border border-foreground/20 px-4 py-3 text-foreground/70 hover:border-primary hover:text-primary transition-all duration-300 hover:-translate-y-0.5"
                aria-label="View resume"
              >
                <span className="text-xs uppercase tracking-widest font-bold" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  View Resume
                </span>
              </a>
              <a
                href={resumePdf}
                download="Utkarsh-Mishra-Resume.pdf"
                className="inline-flex items-center gap-3 bg-primary px-4 py-3 text-primary-foreground hover:bg-foreground hover:text-background transition-all duration-300 hover:-translate-y-0.5"
                aria-label="Download resume"
              >
                <span className="text-xs uppercase tracking-widest font-bold" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  Download Resume
                </span>
              </a>
            </div>
          </div>

          {/* Right: Form */}
          <div>
            {submissionStatus === "success" ? (
              <div className="border border-primary p-12 text-center animate-[softReveal_900ms_cubic-bezier(0.22,1,0.36,1)_both]">
                <div className="text-primary text-6xl font-black mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>✓</div>
                <h3 className="text-2xl font-black uppercase mb-3" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Message Sent</h3>
                <p className="text-foreground/60">I&apos;ll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-0">
                {submitError && submissionStatus === "error" && (
                  <div className="mb-6 border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-foreground">
                    {submitError}
                  </div>
                )}
                {[
                  { name: "name", label: "Your Name", type: "text", placeholder: "Your Name" },
                  { name: "email", label: "Email Address", type: "email", placeholder: "you@example.com" },
                ].map((field) => (
                  <div key={field.name} className="border-b border-foreground/10 pb-0">
                    <label
                      className="block text-xs uppercase tracking-widest text-foreground/40 pt-6 pb-2"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    >
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      required
                      placeholder={field.placeholder}
                      value={formState[field.name as keyof typeof formState]}
                      onChange={(e) => setFormState((prev) => ({ ...prev, [field.name]: e.target.value }))}
                      className="w-full bg-transparent text-foreground text-lg pb-4 outline-none placeholder:text-foreground/20 border-none focus:ring-0 transition-all duration-300 focus:translate-x-0.5"
                    />
                  </div>
                ))}

                <div className="border-b border-foreground/10">
                  <label
                    className="block text-xs uppercase tracking-widest text-foreground/40 pt-6 pb-2"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  >
                    Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell me about the idea or collaboration..."
                    value={formState.message}
                    onChange={(e) => setFormState((prev) => ({ ...prev, message: e.target.value }))}
                    className="w-full bg-transparent text-foreground text-lg pb-4 outline-none placeholder:text-foreground/20 border-none focus:ring-0 resize-none transition-all duration-300 focus:translate-x-0.5"
                  />
                </div>

                <div className="pt-8">
                  <button
                    type="submit"
                    disabled={submissionStatus === "sending"}
                    className="group w-full bg-primary text-primary-foreground py-5 font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-foreground hover:text-background transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-70"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  >
                    {submissionStatus === "sending" ? "Sending..." : "Send Message"}
                    <Send size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-16 px-6 md:px-10 bg-background animate-[softReveal_1000ms_cubic-bezier(0.22,1,0.36,1)_both]" style={{ animationDelay: "60ms" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-12">
            <h2
              className="text-6xl md:text-8xl font-black uppercase text-foreground leading-none"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              Utkarsh<br />
              <span className="text-primary">Mishra.</span>
            </h2>
            <div className="grid grid-cols-2 gap-x-16 gap-y-2">
              <div>
                <p className="text-xs uppercase tracking-widest text-foreground/30 mb-3" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Pages</p>
                {NAV_LINKS.map((l) => (
                  <button key={l} onClick={() => scrollTo(l.toLowerCase())} className="block text-foreground/60 hover:text-primary transition-colors uppercase text-sm font-bold tracking-wider" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    {l}
                  </button>
                ))}
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-foreground/30 mb-3" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Connect</p>
                {SOCIAL_LINKS.map((l) => (
                  <a key={l.label} href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel={l.href.startsWith("http") ? "noreferrer" : undefined} className="block text-foreground/60 hover:text-primary transition-colors uppercase text-sm font-bold tracking-wider" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <p className="text-foreground/30 text-xs uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              © 2026 Utkarsh Mishra. All rights reserved.
            </p>
            <p className="text-foreground/30 text-xs uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Built with React · Focused on Java, AI/ML, and Backend Development
            </p>
          </div>
          <div className="mt-8 text-center md:text-left">
            <p className="text-foreground/50 text-sm italic">
              "It's not the hope that kills you, it's the lack of hope that does."
            </p>
          </div>
          <div className="mt-10 pt-6 border-t border-border/60 text-center animate-[softReveal_1000ms_cubic-bezier(0.22,1,0.36,1)_both]" style={{ animationDelay: "180ms" }}>
            <p className="text-foreground/70 text-sm uppercase tracking-[0.25em]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Thanks for visiting!
            </p>
            <p className="mt-3 text-foreground text-2xl md:text-3xl font-black uppercase tracking-wide" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              If you enjoyed my projects, consider giving them a ⭐.
            </p>
            <p className="mt-4 text-foreground/80 text-base md:text-lg italic animate-[softFloat_7s_ease-in-out_infinite]" style={{ fontFamily: "'DM Serif Display', serif" }}>
              Let's build something awesome together! 🚀
            </p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes softReveal {
          from {
            opacity: 0;
            transform: translateY(14px);
            filter: blur(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }
        @keyframes softPulse {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-1px) scale(1.02);
          }
        }
        @keyframes softFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }
        @keyframes riseFade {
          from {
            opacity: 0;
            transform: translateY(18px);
            filter: blur(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }
        @keyframes ambientOrb {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(0, -18px, 0) scale(1.03);
          }
        }
        @keyframes centerOrb {
          0%, 100% {
            transform: translate3d(-50%, -50%, 0) scale(1);
          }
          50% {
            transform: translate3d(-50%, -50%, 0) scale(1.03);
          }
        }
        @keyframes floatY {
          0%, 100% {
            transform: translate(-50%, 0);
          }
          50% {
            transform: translate(-50%, -8px);
          }
        }
        @keyframes ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001ms !important;
            scroll-behavior: auto !important;
          }
        }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(200,240,58,0.3); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(200,240,58,0.6); }
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
}
