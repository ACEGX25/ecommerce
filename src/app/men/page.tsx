import { products } from "@/lib/products";
import { ProductCard} from "@/components/ProductCard";

const MenPage = () => {
    const menProducts = products.filter((p) => p.category ==="men");
    return(
        <div className="pt=16 min-h-screen">
            <div className="border-b px-4 md:px-8 py6">
                <h1 className="heading-l1 text-[clamp(2rem,5vw,4rem)]">MEN</h1>
                <p className="text-sm text-muted-foreground mt-2 tracking-wide">
                    {menProducts.length} items- Engineered basics for daily wear</p>

            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
                {menProducts.map((product) =>(
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default MenPage;
