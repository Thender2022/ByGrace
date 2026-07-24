import Image from 'next/image';
import Link from 'next/link';

export default function ProductCard({ product }) {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="group cursor-pointer border border-gray-200 hover:border-gold-500 transition-all duration-300 bg-white">
        {/* Product Image */}
        <div className="relative h-64 w-full bg-gray-50 overflow-hidden">
          {product.images && product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No image
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500 uppercase tracking-[0.15em] font-light">
              {product.category}
            </span>
            <div className="flex items-center">
              <span className="text-gold-500 text-sm">✦</span>
              <span className="text-sm text-gray-600 font-light ml-1">{product.rating}</span>
              <span className="text-xs text-gray-400 ml-1">({product.reviews})</span>
            </div>
          </div>
          
          <h3 className="text-base font-light text-gray-900 mb-2 line-clamp-2 tracking-wide">
            {product.name}
          </h3>
          
          <div className="flex items-center justify-between">
            <span className="text-lg font-light text-gold-500">
              ${product.price.toFixed(2)}
            </span>
            <span className={`text-xs tracking-wider ${
              product.stock > 0 ? 'text-black' : 'text-red-500'
            }`}>
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
          
          {/* Color dots preview */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex gap-1.5 mt-3">
              {product.colors.slice(0, 4).map((color, index) => (
                <div
                  key={index}
                  className="w-3.5 h-3.5 rounded-full border border-black"
                  style={{ backgroundColor: color.toLowerCase() }}
                  title={color}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-xs text-gray-400 font-light ml-1">+{product.colors.length - 4}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}