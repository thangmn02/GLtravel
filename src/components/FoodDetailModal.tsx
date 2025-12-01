import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Navigation, Tag } from 'lucide-react';

interface Dish {
    id: string;
    name: string;
    description: string;
    image: string;
    priceRange: string;
    suggestedPlaces: string[];
}

interface FoodDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    dish: Dish | null;
}

const FoodDetailModal: React.FC<FoodDetailModalProps> = ({ isOpen, onClose, dish }) => {
    if (!dish) return null;

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
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden pointer-events-auto relative">

                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-black/40 transition-colors"
                            >
                                <X size={20} />
                            </button>

                            {/* Image */}
                            <div className="h-64 relative">
                                <img
                                    src={dish.image}
                                    alt={dish.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-4 left-6 right-6">
                                    <h2 className="text-3xl font-bold text-white font-serif leading-tight mb-1">{dish.name}</h2>
                                    <span className="inline-block px-2 py-0.5 rounded-md bg-orange-500 text-white text-xs font-bold uppercase tracking-wider">
                                        {dish.priceRange}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <p className="text-zinc-600 mb-6 leading-relaxed">
                                    {dish.description}
                                </p>

                                <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100 mb-6">
                                    <div className="flex items-center gap-2 mb-3 text-orange-800 font-bold text-sm uppercase tracking-wider">
                                        <MapPin size={16} />
                                        <span>Best Places to Eat</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {dish.suggestedPlaces.map((place, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => window.location.href = `/map?q=${encodeURIComponent(place)}`}
                                                className="px-3 py-1 bg-white rounded-full text-sm text-orange-900 border border-orange-200 shadow-sm hover:bg-orange-100 hover:border-orange-300 transition-colors cursor-pointer"
                                            >
                                                {place}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        const query = dish.suggestedPlaces.length > 0 ? dish.suggestedPlaces[0] : dish.name;
                                        window.location.href = `/map?q=${encodeURIComponent(query)}`;
                                    }}
                                    className="w-full py-4 rounded-xl bg-zinc-900 text-white font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors shadow-lg"
                                >
                                    <Navigation size={20} />
                                    <span>Navigate to Map</span>
                                </button>
                            </div>

                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default FoodDetailModal;
