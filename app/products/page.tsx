'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  images: string[];
  isActive: boolean;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Track current page for each row (desktop)
  const [currentPages, setCurrentPages] = useState<{ [key: string]: number }>({});
  // Track current product index for mobile swipe
  const [mobileIndices, setMobileIndices] = useState<{ [key: string]: number }>({});
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  const PRODUCTS_PER_PAGE = 4;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch('/api/products');
        const data = await res.json();
        
        if (res.ok) {
          const activeProducts = data.products.filter((p: Product) => p.isActive !== false);
          setProducts(activeProducts);
        } else {
          setError('Failed to load products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Error loading products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Split products into rows
  const getRowProducts = (rowIndex: number) => {
    const itemsPerRow = Math.ceil(products.length / 4);
    const start = rowIndex * itemsPerRow;
    const end = start + itemsPerRow;
    return products.slice(start, end);
  };

  // Get paginated products for a specific row (desktop)
  const getPaginatedProducts = (rowProducts: Product[], page: number) => {
    const start = page * PRODUCTS_PER_PAGE;
    const end = start + PRODUCTS_PER_PAGE;
    return rowProducts.slice(start, end);
  };

  // Get total pages for a row (desktop)
  const getTotalPages = (rowProducts: Product[]) => {
    return Math.ceil(rowProducts.length / PRODUCTS_PER_PAGE);
  };

  // Navigate a row (desktop)
  const navigateRow = (rowName: string, direction: 'prev' | 'next') => {
    setCurrentPages(prev => {
      const current = prev[rowName] || 0;
      const rowProducts = getRowProducts(rowNames.indexOf(rowName));
      const totalPages = getTotalPages(rowProducts);
      
      let newPage = current;
      if (direction === 'next') {
        newPage = Math.min(current + 1, totalPages - 1);
      } else {
        newPage = Math.max(current - 1, 0);
      }
      
      return { ...prev, [rowName]: newPage };
    });
  };

  // Mobile swipe handlers
  const handleTouchStart = (rowName: string) => (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (rowName: string) => (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (rowName: string) => {
    const rowProducts = getRowProducts(rowNames.indexOf(rowName));
    if (rowProducts.length <= 1) return;
    
    const currentIndex = mobileIndices[rowName] || 0;
    
    if (touchStartX - touchEndX > 50) {
      // Swipe left - next product
      const newIndex = Math.min(currentIndex + 1, rowProducts.length - 1);
      setMobileIndices(prev => ({ ...prev, [rowName]: newIndex }));
    }
    if (touchStartX - touchEndX < -50) {
      // Swipe right - previous product
      const newIndex = Math.max(currentIndex - 1, 0);
      setMobileIndices(prev => ({ ...prev, [rowName]: newIndex }));
    }
    setTouchStartX(0);
    setTouchEndX(0);
  };

  // Mobile navigation
  const mobileNext = (rowName: string) => {
    const rowProducts = getRowProducts(rowNames.indexOf(rowName));
    const currentIndex = mobileIndices[rowName] || 0;
    if (currentIndex < rowProducts.length - 1) {
      setMobileIndices(prev => ({ ...prev, [rowName]: currentIndex + 1 }));
    }
  };

  const mobilePrev = (rowName: string) => {
    const rowProducts = getRowProducts(rowNames.indexOf(rowName));
    const currentIndex = mobileIndices[rowName] || 0;
    if (currentIndex > 0) {
      setMobileIndices(prev => ({ ...prev, [rowName]: currentIndex - 1 }));
    }
  };

  const rowNames = ['Skateboards', 'Hats', 'T-Shirts', 'Hoodies'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-gray-300 border-t-gold-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-light tracking-wider">Loading collection...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-6 py-2 bg-gold-500 text-black rounded hover:bg-gold-400 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 font-light">No products available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-black text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-light tracking-[0.2em] uppercase">
            The Collection
          </h1>
          <p className="text-gray-400 font-light tracking-wider mt-3 text-sm md:text-base">
            Premium skateboarding goods for the modern rider
          </p>
          <div className="w-16 h-px bg-gold-500 mx-auto mt-4" />
        </div>
      </div>

      {/* Product Rows with Slideshow */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {rowNames.map((rowName, index) => {
          const rowProducts = getRowProducts(index);
          const currentPage = currentPages[rowName] || 0;
          const totalPages = getTotalPages(rowProducts);
          const displayedProducts = getPaginatedProducts(rowProducts, currentPage);
          const hasProducts = rowProducts.length > 0;
          
          // Mobile
          const mobileIndex = mobileIndices[rowName] || 0;
          const mobileProduct = rowProducts[mobileIndex];

          return (
            <div key={rowName}>
              {/* Row Header */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl md:text-3xl font-light tracking-[0.15em] text-gray-900 uppercase">
                    {rowName}
                  </h2>
                  <div className="flex-1 h-px bg-gray-200 w-20" />
                  <span className="text-sm text-gray-400 font-light">
                    {rowProducts.length} {rowProducts.length === 1 ? 'item' : 'items'}
                  </span>
                </div>
                
                {/* Desktop Navigation Arrows */}
                {hasProducts && totalPages > 1 && (
                  <div className="hidden md:flex gap-2">
                    <button
                      onClick={() => navigateRow(rowName, 'prev')}
                      disabled={currentPage === 0}
                      className={`p-2 rounded-full border transition-colors ${
                        currentPage === 0
                          ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400'
                      }`}
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={() => navigateRow(rowName, 'next')}
                      disabled={currentPage >= totalPages - 1}
                      className={`p-2 rounded-full border transition-colors ${
                        currentPage >= totalPages - 1
                          ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400'
                      }`}
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </div>
              
              {/* Products Grid - Desktop */}
              {!hasProducts ? (
                <div className="text-center py-8 text-gray-400 font-light border-2 border-dashed border-gray-200 rounded-lg">
                  No products in this category yet
                </div>
              ) : (
                <>
                  {/* Desktop Grid */}
                  <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {displayedProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                  
                  {/* Desktop Page Dots */}
                  {totalPages > 1 && (
                    <div className="hidden md:flex justify-center gap-2 mt-6">
                      {Array.from({ length: totalPages }).map((_, pageIndex) => (
                        <button
                          key={pageIndex}
                          onClick={() => setCurrentPages(prev => ({ ...prev, [rowName]: pageIndex }))}
                          className={`w-2 h-2 rounded-full transition-all ${
                            pageIndex === currentPage
                              ? 'w-6 bg-gold-500'
                              : 'bg-gray-300 hover:bg-gray-400'
                          }`}
                          aria-label={`Go to page ${pageIndex + 1}`}
                        />
                      ))}
                    </div>
                  )}

                  {/* Mobile Slideshow - One Product at a Time */}
                  <div 
                    className="md:hidden relative max-w-xs mx-auto"
                    onTouchStart={handleTouchStart(rowName)}
                    onTouchMove={handleTouchMove(rowName)}
                    onTouchEnd={() => handleTouchEnd(rowName)}
                  >
                    <div className="transition-opacity duration-300">
                      <ProductCard key={mobileProduct.id} product={mobileProduct} />
                    </div>

                    {/* Mobile Navigation Arrows */}
                    {rowProducts.length > 1 && (
                      <>
                        <button
                          onClick={() => mobilePrev(rowName)}
                          disabled={mobileIndex === 0}
                          className={`absolute left-[-30px] top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center transition-colors z-10 bg-white rounded-full shadow-sm border border-gray-200 ${
                            mobileIndex === 0
                              ? 'text-gray-200 cursor-not-allowed'
                              : 'text-gray-400 hover:text-gold-500'
                          }`}
                          aria-label="Previous"
                          type="button"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <button
                          onClick={() => mobileNext(rowName)}
                          disabled={mobileIndex >= rowProducts.length - 1}
                          className={`absolute right-[-30px] top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center transition-colors z-10 bg-white rounded-full shadow-sm border border-gray-200 ${
                            mobileIndex >= rowProducts.length - 1
                              ? 'text-gray-200 cursor-not-allowed'
                              : 'text-gray-400 hover:text-gold-500'
                          }`}
                          aria-label="Next"
                          type="button"
                        >
                          <ChevronRight size={20} />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Mobile Dot Indicators */}
                  {rowProducts.length > 1 && (
                    <div className="md:hidden flex justify-center gap-2 mt-6">
                      {rowProducts.map((_, dotIndex) => (
                        <button
                          key={dotIndex}
                          onClick={() => setMobileIndices(prev => ({ ...prev, [rowName]: dotIndex }))}
                          className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                            dotIndex === mobileIndex
                              ? 'bg-gold-500 w-8'
                              : 'bg-gray-300 hover:bg-gray-400'
                          }`}
                          aria-label={`Go to product ${dotIndex + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}