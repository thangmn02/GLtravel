export interface Food {
  id: string;
  name: string;
  nameVi: string;
  category: string;
  price: string;
  priceVi: string;
  stars: number;
  image: string;
  description: string;
  descriptionVi: string;
  ingredients?: string[];
  ingredientsVi?: string[];
}

export const foods: Food[] = [
  // Noodle Soups
  {
    id: 'pho-ga',
    name: 'Chicken Pho',
    nameVi: 'Phở Gà',
    category: 'noodle-soup',
    price: '$8.99',
    priceVi: '45.000đ',
    stars: 4.8,
    image: '/images/foods/items/pho-ga.jpg',
    description: 'Traditional Vietnamese chicken noodle soup with herbs',
    descriptionVi: 'Phở gà truyền thống với rau thơm',
    ingredients: ['Rice noodles', 'Chicken', 'Herbs', 'Bean sprouts'],
    ingredientsVi: ['Bánh phở', 'Gà', 'Rau thơm', 'Giá đỗ']
  },
  {
    id: 'bun-thang',
    name: 'Bun Thang',
    nameVi: 'Bún Thang',
    category: 'noodle-soup',
    price: '$9.50',
    priceVi: '50.000đ',
    stars: 4.7,
    image: '/images/foods/items/bun-thang.jpg',
    description: 'Delicate vermicelli soup with chicken, egg, and shrimp',
    descriptionVi: 'Bún với gà, trứng và tôm',
    ingredients: ['Vermicelli', 'Chicken', 'Egg', 'Shrimp', 'Herbs'],
    ingredientsVi: ['Bún', 'Gà', 'Trứng', 'Tôm', 'Rau thơm']
  },
  
  // Dry Dishes
  {
    id: 'com-tam',
    name: 'Broken Rice',
    nameVi: 'Cơm Tấm',
    category: 'dry-dishes',
    price: '$10.99',
    priceVi: '55.000đ',
    stars: 4.9,
    image: '/images/foods/items/com-tam.jpg',
    description: 'Broken rice with grilled pork, egg, and pickled vegetables',
    descriptionVi: 'Cơm tấm sườn nướng, trứng và đồ chua',
    ingredients: ['Broken rice', 'Grilled pork', 'Fried egg', 'Pickles'],
    ingredientsVi: ['Cơm tấm', 'Sườn nướng', 'Trứng chiên', 'Đồ chua']
  },
  {
    id: 'banh-mi',
    name: 'Vietnamese Sandwich',
    nameVi: 'Bánh Mì',
    category: 'dry-dishes',
    price: '$6.50',
    priceVi: '30.000đ',
    stars: 4.8,
    image: '/images/foods/items/banh-mi.jpg',
    description: 'Crispy baguette with pate, meats, and fresh vegetables',
    descriptionVi: 'Bánh mì giòn với pate, thịt và rau tươi',
    ingredients: ['Baguette', 'Pate', 'Cold cuts', 'Vegetables', 'Herbs'],
    ingredientsVi: ['Bánh mì', 'Pate', 'Thịt nguội', 'Rau củ', 'Rau thơm']
  },
  
  // Grilled
  {
    id: 'thit-nuong',
    name: 'Grilled Pork',
    nameVi: 'Thịt Nướng',
    category: 'grilled',
    price: '$12.99',
    priceVi: '65.000đ',
    stars: 4.9,
    image: '/images/foods/items/thit-nuong.jpg',
    description: 'Marinated grilled pork with lemongrass and fish sauce',
    descriptionVi: 'Thịt heo nướng sả với nước mắm',
    ingredients: ['Pork', 'Lemongrass', 'Fish sauce', 'Garlic'],
    ingredientsVi: ['Thịt heo', 'Sả', 'Nước mắm', 'Tỏi']
  },
  
  // Desserts
  {
    id: 'che-ba-mau',
    name: 'Three Color Dessert',
    nameVi: 'Chè Ba Màu',
    category: 'desserts',
    price: '$4.50',
    priceVi: '25.000đ',
    stars: 4.6,
    image: '/images/foods/items/che-ba-mau.jpg',
    description: 'Layered dessert with beans, jelly, and coconut milk',
    descriptionVi: 'Chè với đậu, thạch và nước cốt dừa',
    ingredients: ['Mung beans', 'Red beans', 'Pandan jelly', 'Coconut milk'],
    ingredientsVi: ['Đậu xanh', 'Đậu đỏ', 'Thạch lá dứa', 'Nước cốt dừa']
  },
  
  // Beverages
  {
    id: 'ca-phe-sua-da',
    name: 'Iced Coffee with Milk',
    nameVi: 'Cà Phê Sữa Đá',
    category: 'beverages',
    price: '$3.50',
    priceVi: '20.000đ',
    stars: 4.9,
    image: '/images/foods/items/ca-phe-sua-da.jpg',
    description: 'Strong Vietnamese coffee with condensed milk over ice',
    descriptionVi: 'Cà phê đậm với sữa đặc và đá',
    ingredients: ['Coffee', 'Condensed milk', 'Ice'],
    ingredientsVi: ['Cà phê', 'Sữa đặc', 'Đá']
  }
];
