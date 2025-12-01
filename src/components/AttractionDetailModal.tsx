// src/components/AttractionDetailModal.tsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Star, Heart, Navigation, Clock, Ruler, Share2 } from 'lucide-react';
import type { Attraction } from '../data/attractions';

interface AttractionDetailModalProps {
    attraction: Attraction | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function AttractionDetailModal({ attraction, isOpen, onClose }: AttractionDetailModalProps) {
    if (!attraction) return null;

    const handleNavigate = (e: React.MouseEvent) => {
        e.stopPropagation(); // Ngăn chặn sự kiện click lan ra ngoài
        const query = encodeURIComponent(`${attraction.title} ${attraction.location}`);
        // Dùng link Universal chuẩn của Google Maps
        window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
    };

    const handleHeart = (e: React.MouseEvent) => {
        e.stopPropagation();
        alert("Đã thêm vào yêu thích! (Demo)");
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm"
                    />

                    {/* Modal Container */}
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 z-[70] h-[92vh] bg-zinc-900 rounded-t-[32px] overflow-hidden flex flex-col shadow-2xl border-t border-white/10"
                    >
                        {/* --- HERO SECTION --- */}
                        <div className="relative w-full h-[45vh] shrink-0 bg-black">
                            {/* Gallery Scroll */}
                            <div className="w-full h-full flex overflow-x-auto snap-x snap-mandatory no-scrollbar touch-pan-x">
                                {attraction.images.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        className="w-full h-full object-cover snap-center shrink-0"
                                        alt=""
                                    />
                                ))}
                            </div>

                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-3 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full text-white z-20 active:scale-90 transition-transform"
                            >
                                <X size={20} />
                            </button>

                            {/* Counter Badge */}
                            <div className="absolute bottom-6 right-6 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs font-medium text-white/90 z-20 border border-white/10">
                                1/{attraction.images.length}
                            </div>
                        </div>

                        {/* --- CONTENT SCROLL --- */}
                        <div className="flex-1 overflow-y-auto bg-zinc-900 relative">
                            <div className="p-6 md:p-8 pb-32 space-y-8">

                                {/* Header */}
                                <div>
                                    <h2 className="text-3xl font-bold text-white mb-3 leading-tight tracking-tight">
                                        {attraction.title}
                                    </h2>
                                    <div className="flex items-center gap-4 text-zinc-400 text-sm font-medium">
                                        <span className="flex items-center gap-1"><MapPin size={14} className="text-orange-500" /> {attraction.location}</span>
                                        <span className="flex items-center gap-1"><Star size={14} className="text-yellow-500 fill-yellow-500" /> {attraction.rating}</span>
                                    </div>
                                </div>

                                {/* Info Cards */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                        <div className="flex items-center gap-2 text-zinc-500 mb-1 text-[10px] uppercase tracking-wider font-bold">
                                            <Clock size={12} /> Best Time
                                        </div>
                                        <div className="text-white font-semibold">{attraction.bestTime}</div>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                        <div className="flex items-center gap-2 text-zinc-500 mb-1 text-[10px] uppercase tracking-wider font-bold">
                                            <Ruler size={12} /> Distance
                                        </div>
                                        <div className="text-white font-semibold">{attraction.distance}</div>
                                    </div>
                                </div>

                                {/* The Story */}
                                <div>
                                    <h3 className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-3">The Story</h3>
                                    <p className="text-zinc-300 leading-relaxed text-lg font-serif">
                                        {attraction.story}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* --- FLOATING ACTION DOCK (FIXED Z-INDEX) --- */}
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-6">
                            <div className="flex items-center gap-2 p-2 rounded-[24px] bg-white/10 backdrop-blur-2xl border border-white/10 shadow-2xl">

                                {/* Heart Button */}
                                <button
                                    onClick={handleHeart}
                                    className="w-14 h-14 flex items-center justify-center rounded-full bg-black/20 text-white hover:bg-black/40 active:scale-95 transition-all shrink-0"
                                >
                                    <Heart size={24} />
                                </button>

                                {/* Navigate Button */}
                                <button
                                    onClick={handleNavigate}
                                    className="flex-1 h-14 flex items-center justify-center gap-2 rounded-[20px] bg-white text-black font-bold text-lg hover:bg-gray-200 active:scale-95 transition-all"
                                >
                                    <Navigation size={20} fill="currentColor" />
                                    Navigate
                                </button>

                            </div>
                        </div>

                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}