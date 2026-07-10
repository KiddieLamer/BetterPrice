import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const fallbackImage = "/globe.svg";

  return (
    <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-surface">
      <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
        <img
          src={product.image || fallbackImage}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = fallbackImage; }}
        />
      </div>
      <div className="min-w-0 flex-1">
        <h1 className="text-[17px] font-semibold leading-snug truncate">
          {product.name}
        </h1>
        <p className="text-[14px] text-muted mt-1">
          Toko: {product.shopName}
        </p>
      </div>
    </div>
  );
}
