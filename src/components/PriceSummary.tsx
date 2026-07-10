interface PriceSummaryProps {
  lowestPrice: number;
  highestPrice: number;
}

function formatPrice(price: number): string {
  return `Rp ${price.toLocaleString("id-ID")}`;
}

export default function PriceSummary({ lowestPrice, highestPrice }: PriceSummaryProps) {
  const savings = highestPrice - lowestPrice;
  const hasSavings = savings > 0;

  return (
    <div className="text-center py-4">
      <p className="text-[14px] text-muted">Harga Termurah</p>
      <p className="text-[28px] font-bold text-accent">{formatPrice(lowestPrice)}</p>
      {hasSavings && (
        <p className="text-[13px] text-muted mt-1">
          Hemat {formatPrice(savings)} dari harga termahal
        </p>
      )}
    </div>
  );
}
