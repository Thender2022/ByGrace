import Image from 'next/image';
import Link from 'next/link';

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  images: string[];
  isActive: boolean;
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="group cursor-pointer border border-gray-200 hover:border-gold-500 transition-all duration-300 bg-white">
        {/* Product Image */}
        <div className="relative h-64 w-full bg-gray-50 overflow-hidden">
          {product.images && product.images.length > 0 ? (
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
          <h3 className="text-base font-light text-gray-900 mb-2 line-clamp-2 tracking-wide">
            {product.name}
          </h3>
          
          <div className="flex items-center justify-between">
            <span className="text-lg font-light text-gold-500">
              {product.currency.toUpperCase()} {product.price.toFixed(2)}
            </span>
            <span className="text-xs tracking-wider text-black">
              In Stock
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}