import { products, getProductById } from '@/lib/products';
import Link from 'next/link';
import ProductDetailClient from '@/components/ProductDetailClient';

export default async function ProductDetailPage({ params }) {
  // Get the id from params
  const { id } = await params;
  const product = getProductById(id);
  
  // If product not found, show 404 message
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
        <Link href="/products" className="text-blue-600 hover:underline mt-4 inline-block">
          Back to products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm">
        <Link href="/products" className="text-blue-600 hover:underline">
          ← Back to all products
        </Link>
      </div>

      <ProductDetailClient product={product} />
    </div>
  );
}