export const products = [
    {
      id: '1',
      name: 'Classic Skateboard Deck - 8.0"',
      description: 'High-quality maple deck with premium grip tape. Perfect for street and park skating.',
      price: 59.99,
      category: 'skateboards',
      images: ['/images/board1.jpg'],
      sizes: ['8.0"', '8.25"', '8.5"'],
      colors: ['Black', 'White', 'Red'],
      stock: 25,
      rating: 4.8,
      reviews: 127
    },
    {
      id: '2',
      name: 'Pro Trucks - Set of 2',
      description: 'Lightweight aluminum trucks with precision engineering for smooth turning and grinding.',
      price: 34.99,
      category: 'parts',
      images: ['/images/trucks1.jpg'],
      sizes: ['7.75"', '8.0"', '8.25"'],
      colors: ['Silver', 'Black', 'Gold'],
      stock: 50,
      rating: 4.6,
      reviews: 89
    },
    {
      id: '3',
      name: 'Skateboard Wheels - 52mm 99a',
      description: 'High-rebound urethane wheels for excellent speed and grip on any surface.',
      price: 29.99,
      category: 'parts',
      images: ['/images/wheels1.jpg'],
      sizes: ['52mm', '54mm', '56mm'],
      colors: ['White', 'Red', 'Blue', 'Green'],
      stock: 40,
      rating: 4.7,
      reviews: 104
    },
    {
      id: '4',
      name: 'Skate Shoes - Pro Model',
      description: 'Durable suede skate shoes with impact-absorbing insoles and vulcanized rubber sole.',
      price: 74.99,
      category: 'apparel',
      images: ['/images/shoes1.jpg'],
      sizes: ['8', '8.5', '9', '9.5', '10', '10.5'],
      colors: ['Black/White', 'Blue/White', 'Red/Black'],
      stock: 30,
      rating: 4.9,
      reviews: 215
    },
    {
      id: '5',
      name: 'Skateboard T-Shirt - Logo',
      description: 'Premium cotton t-shirt with our signature logo. Perfect for everyday wear.',
      price: 24.99,
      category: 'apparel',
      images: ['/images/tshirt1.jpg'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Black', 'White', 'Navy'],
      stock: 60,
      rating: 4.5,
      reviews: 76
    },
    {
      id: '6',
      name: 'Complete Skateboard - 8.0"',
      description: 'Ready to ride complete skateboard with deck, trucks, wheels, and bearings included.',
      price: 129.99,
      category: 'skateboards',
      images: ['/images/complete1.jpg'],
      sizes: ['7.75"', '8.0"', '8.25"'],
      colors: ['Black', 'Blue', 'Red', 'Green'],
      stock: 15,
      rating: 4.8,
      reviews: 198
    },
    {
      id: '7',
      name: 'Skateboard Bearings - ABEC 7',
      description: 'Precision bearings with speed lubricant for smooth, fast rides.',
      price: 19.99,
      category: 'parts',
      images: ['/images/bearings1.jpg'],
      sizes: ['Standard'],
      colors: ['Silver'],
      stock: 100,
      rating: 4.4,
      reviews: 62
    },
    {
      id: '8',
      name: 'Skateboard Backpack',
      description: 'Durable backpack with skateboard straps, laptop sleeve, and multiple compartments.',
      price: 49.99,
      category: 'apparel',
      images: ['/images/backpack1.jpg'],
      sizes: ['One Size'],
      colors: ['Black', 'Navy', 'Olive'],
      stock: 35,
      rating: 4.6,
      reviews: 88
    }
  ];
  
  export function getProductById(id) {
    return products.find(product => product.id === id);
  }
  
  export function getProductsByCategory(category) {
    return products.filter(product => product.category === category);
  }
  
  export function getFeaturedProducts() {
    // Return first 4 products as featured
    return products.slice(0, 4);
  }