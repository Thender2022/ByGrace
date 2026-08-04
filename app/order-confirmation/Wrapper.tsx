'use client';

import dynamic from 'next/dynamic';

const OrderConfirmationContent = dynamic(
  () => import('@/app/order-confirmation/Context'),
  { ssr: false }
);

export default function OrderConfirmationWrapper() {
  return <OrderConfirmationContent />;
}