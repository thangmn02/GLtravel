export interface Category {
  id: string;
  name: string;
  nameVi: string;
  icon: string;
  description: string;
  descriptionVi: string;
  image: string;
}

export const categories: Category[] = [
  {
    id: 'noodle-soup',
    name: 'Noodle Soups',
    nameVi: 'Phở & Bún',
    icon: '/images/foods/categories/noodle-soup.jpg',
    description: 'Traditional Vietnamese noodle soups including Pho and Bun',
    descriptionVi: 'Các món phở và bún truyền thống Việt Nam',
    image: '/images/foods/categories/noodle-soup.jpg'
  },
  {
    id: 'dry-dishes',
    name: 'Dry Dishes',
    nameVi: 'Món Khô',
    icon: '/images/foods/categories/dry-dishes.jpg',
    description: 'Rice dishes, grilled meats, and dry noodles',
    descriptionVi: 'Cơm, thịt nướng và mì khô',
    image: '/images/foods/categories/dry-dishes.jpg'
  },
  {
    id: 'grilled',
    name: 'Grilled & BBQ',
    nameVi: 'Nướng & BBQ',
    icon: '/images/foods/categories/grilled.jpg',
    description: 'Grilled meats, seafood, and vegetables',
    descriptionVi: 'Thịt nướng, hải sản và rau củ nướng',
    image: '/images/foods/categories/grilled.jpg'
  },
  {
    id: 'desserts',
    name: 'Desserts',
    nameVi: 'Tráng Miệng',
    icon: '/images/foods/categories/desserts.jpg',
    description: 'Sweet treats and traditional desserts',
    descriptionVi: 'Món ngọt và tráng miệng truyền thống',
    image: '/images/foods/categories/desserts.jpg'
  },
  {
    id: 'beverages',
    name: 'Beverages',
    nameVi: 'Đồ Uống',
    icon: '/images/foods/categories/beverages.jpg',
    description: 'Coffee, tea, and traditional drinks',
    descriptionVi: 'Cà phê, trà và đồ uống truyền thống',
    image: '/images/foods/categories/beverages.jpg'
  }
];
