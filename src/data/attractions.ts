export interface Attraction {
    id: string;
    title: string;
    location: string;
    rating: number;
    description: string;
    story: string;       // Rich story text
    bestTime: string;    // e.g., "Nov - Mar"
    distance: string;    // e.g., "12 km"
    images: string[];    // Array of image URLs
}

export const attractions: Attraction[] = [
    {
        id: '1',
        title: 'Bien Ho (T\'Nung Lake)',
        location: 'Pleiku City',
        rating: 4.8,
        description: 'The "Eyes of Pleiku", a stunning volcanic crater lake.',
        story: 'Legend says this lake was formed by the tears of villagers mourning their loved ones after a catastrophic earthquake destroyed their village centuries ago. The water is crystal clear and never runs dry, symbolizing the sorrow and beauty of the land.',
        bestTime: 'Oct - Mar',
        distance: '7 km',
        images: [
            'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&q=80'
        ]
    },
    {
        id: '2',
        title: 'Chu Dang Ya Volcano',
        location: 'Chu Pah District',
        rating: 4.9,
        description: 'A dormant volcano famous for its wild sunflower season.',
        story: 'Millions of years ago, this was a fierce active volcano. Today, it is a peaceful giant covered in rich basalt soil. Every November, the mountain "wakes up" not with lava, but with a vibrant explosion of yellow Wild Sunflowers, attracting travelers from all over.',
        bestTime: 'November',
        distance: '30 km',
        images: [
            'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1501854140884-074bf86ee91c?auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1434394354979-a235cd36269d?auto=format&fit=crop&q=80'
        ]
    },
    {
        id: '3',
        title: 'Minh Thanh Pagoda',
        location: 'Pleiku City',
        rating: 4.7,
        description: 'A unique architectural masterpiece with Japanese influence.',
        story: 'Not just a place of worship, Minh Thanh Pagoda is an architectural wonder featuring a 9-story stupa and curved roofs reminiscent of Japanese temples. It offers a serene escape and is arguably the most photogenic spot in the city during sunset.',
        bestTime: 'All Year',
        distance: '2 km',
        images: [
            'https://images.unsplash.com/photo-1542640244-7e67286feb8f?auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1528360983277-13d9b152c6d1?auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&q=80'
        ]
    }
];
