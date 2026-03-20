import Link from "next/link";
import Image from "next/image";

const Index = () => {
  return (
    <div className="pt-16 min-h-screen">
      <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)]">

        <Link href="/men" className="relative flex-1 group overflow-hidden border-b md:border-b-0 md:border-r">
          <Image src="/assets/hero-men.jpg" alt="Men's collection" fill className="object-cover object-top" />
          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300" />
          <div className="absolute inset-0 flex items-end p-8">
            <div>
              <h2 className="heading-l1 text-[clamp(3rem,8vw,6rem)] text-background drop-shadow-sm">MEN</h2>
              <p className="text-background/80 text-sm mt-2 tracking-wide">Engineered for daily wear</p>
            </div>
          </div>
        </Link>

        <Link href="/women" className="relative flex-1 group overflow-hidden">
          <Image src="/assets/hero-women.jpg" alt="Women's collection" fill className="object-cover object-top" />
          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300" />
          <div className="absolute inset-0 flex items-end p-8">
            <div>
              <h2 className="heading-l1 text-[clamp(3rem,8vw,6rem)] text-background drop-shadow-sm">WOMEN</h2>
              <p className="text-background/80 text-sm mt-2 tracking-wide">Precision in every stitch</p>
            </div>
          </div>
        </Link>

      </div>

      {/* Marquee strip */}
      <div className="border-t border-b py-4 overflow-hidden">
        <div className="flex gap-12 animate-[marquee_20s_linear_infinite] whitespace-nowrap">
          {Array(3)
            .fill(["SUPIMA COTTON", "HEATTECH", "AIRISM", "DRY-EX", "BLOCKTECH", "ULTRA LIGHT DOWN"])
            .flat()
            .map((text, i) => (
              <span key={i} className="text-xs font-mono tracking-widest text-muted-foreground uppercase">
                {text}
              </span>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Index;