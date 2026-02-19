import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-mesh selection:bg-red-100 selection:text-red-600">
            <Navbar />
            <Hero />
            <Features />
            <HowItWorks />
            <CTA />
            <Footer />
        </div>
    );
};

export default LandingPage;
