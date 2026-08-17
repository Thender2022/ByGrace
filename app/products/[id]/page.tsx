'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ChevronDown } from 'lucide-react';

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  images: string[];
  isActive: boolean;
};

// Define available sizes for different product categories
const SIZE_OPTIONS: { [key: string]: string[] } = {
  'Skateboards': ['7.75', '8.0', '8.125', '8.25', '8.38', '8.5'],
  'T-Shirts': ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  'Hoodies': ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  'Hats': ['S/M', 'L/XL', 'One Size'],
  'Default': ['One Size']
};

export default function ProductDetail() {
  const params = useParams();
  const productId = params.id as string;
  const { addToCart, openCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedVariant, setSelectedVariant] = useState('Default');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Get default size based on product name or category
  const getDefaultSize = (product: Product) => {
    const name = product.name.toLowerCase();
    let category = 'Default';
    
    if (name.includes('skateboard') || name.includes('deck')) {
      category = 'Skateboards';
    } else if (name.includes('shirt') || name.includes('tee')) {
      category = 'T-Shirts';
    } else if (name.includes('hoodie') || name.includes('sweatshirt')) {
      category = 'Hoodies';
    } else if (name.includes('hat') || name.includes('cap') || name.includes('beanie')) {
      category = 'Hats';
    }
    
    const sizes = SIZE_OPTIONS[category] || SIZE_OPTIONS['Default'];
    return sizes[0] || 'One Size';
  };

  // Get size options for current product
  const getSizeOptions = () => {
    const name = product?.name.toLowerCase() || '';
    let category = 'Default';
    
    if (name.includes('skateboard') || name.includes('deck')) {
      category = 'Skateboards';
    } else if (name.includes('shirt') || name.includes('tee')) {
      category = 'T-Shirts';
    } else if (name.includes('hoodie') || name.includes('sweatshirt')) {
      category = 'Hoodies';
    } else if (name.includes('hat') || name.includes('cap') || name.includes('beanie')) {
      category = 'Hats';
    }
    
    return SIZE_OPTIONS[category] || SIZE_OPTIONS['Default'];
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch('/api/products');
        const data = await res.json();
        
        if (res.ok) {
          const foundProduct = data.products.find((p: Product) => p.id === productId);
          if (foundProduct) {
            setProduct(foundProduct);
            const defaultSize = getDefaultSize(foundProduct);
            setSelectedSize(defaultSize);
          } else {
            setError('Product not found');
          }
        } else {
          setError('Failed to load product');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Error loading product');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, selectedSize, selectedVariant);
      setAddedToCart(true);
      openCart();
      setTimeout(() => setAddedToCart(false), 3000);
    }
  };

  const sizeOptions = getSizeOptions();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-gray-300 border-t-gold-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-light tracking-wider">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-light mb-4">{error || 'Product not found'}</h1>
          <Link href="/products" className="text-black underline">
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Product Image */}
          <div className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-sm">
            {product.images && product.images.length > 0 ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover object-center"
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No image available
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            {/* Breadcrumb */}
            <div className="text-sm text-gray-500 font-light mb-2">
              <Link href="/products" className="hover:text-black transition-colors">
                Products
              </Link>
              <span className="mx-2">/</span>
              <span>{product.name}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-light tracking-wide">
              {product.name}
            </h1>
            
            <p className="text-2xl sm:text-3xl font-light mt-2 text-gray-900">
              {product.currency.toUpperCase()} {product.price.toFixed(2)}
            </p>
            
            {product.description && (
              <p className="text-gray-600 font-light mt-4 leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Size Selection Dropdown - Smaller */}
            {sizeOptions.length > 0 && (
              <div className="mt-6 max-w-[200px]">
                <label className="block text-xs font-light text-gray-700 uppercase tracking-wider mb-1.5">
                  Select Size
                </label>
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-md hover:border-black transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 text-sm"
                  >
                    <span className={`font-light text-sm ${selectedSize ? 'text-gray-900' : 'text-gray-400'}`}>
                      {selectedSize || 'Choose a size'}
                    </span>
                    <ChevronDown 
                      size={16} 
                      className={`text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden">
                      {sizeOptions.map((size) => (
                        <button
                          key={size}
                          onClick={() => {
                            setSelectedSize(size);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors text-sm font-light ${
                            selectedSize === size ? 'bg-gray-100 text-black' : 'text-gray-700'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!selectedSize}
              className={`mt-6 sm:mt-8 px-8 py-3 text-white transition-colors font-light tracking-[0.15em] uppercase text-sm ${
                addedToCart 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : !selectedSize 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-black hover:bg-gray-800'
              }`}
            >
              {addedToCart ? '✓ Added to Cart' : !selectedSize ? 'Select Size' : 'Add to Cart'}
            </button>

            <Link
              href="/products"
              className="mt-4 text-sm text-gray-500 hover:text-black transition-colors"
            >
              ← Back to Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}