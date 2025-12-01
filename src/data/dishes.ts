export interface Dish {
    id: string;
    name: string;
    description: string;
    image: string;
    priceRange: string;
    suggestedPlaces: string[];
}

export const dishes: Dish[] = [
    {
        id: '1',
        name: 'Phở Khô (Dry Pho)',
        description: 'The signature dish of Gia Lai. Two bowls: one for dry noodles with special sauce, one for rich broth.',
        image: 'https://images.unsplash.com/photo-1582878826618-c05326eff950?auto=format&fit=crop&q=80',
        priceRange: '40k - 60k',
        suggestedPlaces: ['Phở Hồng', 'Phở Ngọc Sơn', 'Phở Hạnh']
    },
    {
        id: '2',
        name: 'Bún Mắm Cua',
        description: 'Fermented crab noodles. A pungent, savory, and spicy acquired taste that locals love.',
        image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&q=80', // Placeholder for noodle soup
        priceRange: '20k - 35k',
        suggestedPlaces: ['Bún Cua Chi Lăng', 'Chợ Trung Tâm']
    },
    {
        id: '3',
        name: 'Gà Nướng Cơm Lam',
        description: 'Grilled chicken with bamboo rice. Smoky, aromatic, and perfect for sharing.',
        image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&q=80',
        priceRange: '250k - 300k',
        suggestedPlaces: ['Bazans', 'Pleiku Xanh', 'Tiên Sơn']
    },
    {
        id: '4',
        name: 'Muối Kiến Vàng',
        description: 'Weaver ant salt. tangy, crunchy, and unique. Best dipped with beef or chicken.',
        image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&q=80', // Abstract texture
        priceRange: '50k / jar',
        suggestedPlaces: ['Specialty Shops', 'Chợ Pleiku']
    },
    {
        id: '5',
        name: 'Bò Một Nắng',
        description: 'Sun-dried beef. Chewy, flavorful, and best served with ant salt.',
        image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80', // Grilled meat
        priceRange: '500k / kg',
        suggestedPlaces: ['Krong Pa Specialties', 'Local Markets']
    }
];
