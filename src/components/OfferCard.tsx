import type { Offer } from "@/types/offer";

interface OfferCardProps {
  offer: Offer;
}

function formatPrice(price: number): string {
  return `Rp ${price.toLocaleString("id-ID")}`;
}

export default function OfferCard({ offer }: OfferCardProps) {
  return (
    <div
      className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
        offer.isLowest
          ? "border-green-200 bg-green-50"
          : "border-gray-100 bg-white"
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-[15px] font-medium truncate">{offer.storeName}</p>
          {offer.isLowest && (
            <span className="text-[11px] font-medium text-white bg-green-500 px-2 py-0.5 rounded-full whitespace-nowrap">
              Termurah
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-1 text-[13px] text-muted">
          {offer.rating && <span>⭐ {offer.rating}</span>}
          {offer.location && <span>{offer.location}</span>}
          {offer.historicalSold && (
            <span>{offer.historicalSold >= 1000 ? `${(offer.historicalSold / 1000).toFixed(1)}rb` : offer.historicalSold} terjual</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0 ml-3">
        <div className="text-right">
          <p className="text-[16px] font-semibold">{formatPrice(offer.price)}</p>
          {offer.originalPrice && offer.originalPrice > offer.price && (
            <p className="text-[12px] text-muted line-through">
              {formatPrice(offer.originalPrice)}
            </p>
          )}
        </div>
        <a
          href={offer.url}
          target="_blank"
          rel="noopener noreferrer"
          className="h-9 px-4 rounded-lg bg-black text-white text-[13px] font-medium hover:bg-gray-800 transition-colors flex items-center"
        >
          Beli
        </a>
      </div>
    </div>
  );
}
