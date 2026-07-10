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
            <span className="text-[11px] font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-md whitespace-nowrap">
              Termurah
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1 text-[13px] text-muted">
          {offer.rating && (
            <span className="font-medium text-foreground">{offer.rating.toFixed(1)}</span>
          )}
          {offer.location && (
            <>
              <span className="text-gray-300">·</span>
              <span>{offer.location}</span>
            </>
          )}
          {offer.historicalSold && (
            <>
              <span className="text-gray-300">·</span>
              <span>{offer.historicalSold >= 1000 ? `${(offer.historicalSold / 1000).toFixed(1)}rb` : offer.historicalSold} terjual</span>
            </>
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
