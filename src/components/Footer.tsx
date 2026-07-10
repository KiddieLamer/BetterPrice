export default function Footer() {
  return (
    <footer className="border-t border-gray-100 py-6 px-4">
      <div className="max-w-[640px] mx-auto text-center text-[13px] text-muted leading-relaxed">
        <p className="mb-1">BetterPrice &copy; {new Date().getFullYear()}</p>
        <p>
          Kami mendapat komisi dari pembelian melalui link afiliasi.
          Harga dapat berubah sewaktu-waktu.
        </p>
      </div>
    </footer>
  );
}
