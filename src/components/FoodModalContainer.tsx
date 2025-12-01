import React, { useState, useEffect } from 'react';
import FoodDetailModal from './FoodDetailModal';

// We need to import the dishes data to find the full object based on ID
// However, since this is a client-side component, we might not want to duplicate the data import if it's large.
// But for now, importing it is fine.
import { dishes } from '../data/dishes';

const FoodModalContainer: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDish, setSelectedDish] = useState<any>(null);

    useEffect(() => {
        const handleSpinComplete = (event: CustomEvent) => {
            const result = event.detail;
            if (result && result.id) {
                // Find the full dish object
                const dish = dishes.find(d => d.id === result.id);
                if (dish) {
                    setSelectedDish(dish);
                    // Small delay to allow the user to see the wheel stop
                    setTimeout(() => {
                        setIsOpen(true);
                    }, 500);
                }
            }
        };

        window.addEventListener('spin-complete', handleSpinComplete as EventListener);

        return () => {
            window.removeEventListener('spin-complete', handleSpinComplete as EventListener);
        };
    }, []);

    return (
        <FoodDetailModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            dish={selectedDish}
        />
    );
};

export default FoodModalContainer;
