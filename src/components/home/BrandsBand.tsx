export default function BrandsBand() {
  const brands = ["INTEL", "AMD", "NVIDIA", "SAMSUNG", "SONY"];
  return (
    <section className="border-b bg-white py-7 sm:py-9">
      <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-x-8 gap-y-4 px-4 text-center text-xl font-black tracking-widest text-slate-300 lg:justify-between lg:px-8">
        {brands.map((brand) => (
          <span key={brand}>{brand}</span>
        ))}
      </div>
    </section>
  );
}
