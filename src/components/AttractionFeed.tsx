// src/components/AttractionFeed.tsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';
import AttractionDetailModal from './AttractionDetailModal';
import { attractions, type Attraction } from '../data/attractions';

export default function AttractionFeed() {
    const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);

    return (
        <div className="relative w-full h-screen bg-black text-white overflow-y-scroll snap-y snap-mandatory scroll-smooth">
            {/* Loop qua danh sách địa điểm */}
            {attractions.map((item) => (
                <section
                    key={item.id}
                    className="relative w-full h-screen snap-start flex flex-col justify-end p-6 md:p-12 overflow-hidden"
                >
                    {/* Background Image (Ken Burns Effect) */}
                    <div className="absolute inset-0 z-0">
                        <motion.img
                            src={item.images[0]} // Dùng images[0] thay vì gallery[0]
                            alt={item.title}
                            className="w-full h-full object-cover"
                            initial={{ scale: 1 }}
                            whileInView={{ scale: 1.1 }}
                            transition={{ duration: 10, ease: "linear" }}
                        />
                        {/* Gradient Overlay để đọc chữ cho dễ */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 max-w-lg mb-20 md:mb-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 className="text-4xl md:text-6xl font-bold mb-2 tracking-tight leading-none">
                                {item.title}
                            </h2>

                            <div className="flex items-center gap-2 text-white/80 mb-4 text-lg">
                                <MapPin size={20} className="text-orange-500" />
                                <span>{item.location}</span>
                            </div>

                            <p className="text-white/70 line-clamp-2 mb-6 text-lg">
                                {item.description}
                            </p>

                            <button
                                onClick={() => setSelectedAttraction(item)}
                                className="group flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-8 py-4 rounded-full transition-all active:scale-95"
                            >
                                <span className="font-semibold tracking-wide">Khám phá</span>
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    </div>
                </section>
            ))}

            {/* Modal Chi tiết */}
            <AttractionDetailModal
                isOpen={!!selectedAttraction}
                attraction={selectedAttraction}
                onClose={() => setSelectedAttraction(null)}
            />
        </div>
    );
}