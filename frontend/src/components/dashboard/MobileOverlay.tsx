import { motion, AnimatePresence } from "framer-motion";

interface MobileOverlayProps {
    isSidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

const MobileOverlay = ({ isSidebarOpen, setSidebarOpen }: MobileOverlayProps) => {
    return (
        <AnimatePresence>
            {!isSidebarOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSidebarOpen(true)}
                    className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
                />
            )}
        </AnimatePresence>
    );
};

export default MobileOverlay;
