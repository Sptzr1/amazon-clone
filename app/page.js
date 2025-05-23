import HeroBanner from "@/components/HeroBanner"
import CategoryGrid from "@/components/CategoryGrid"
import ProductCarousel from "@/components/ProductCarousel"
import SpecialOffers from "@/components/SpecialOffers"

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <HeroBanner />

      <section className="my-8">
        <h2 className="text-2xl font-bold mb-4">Categorías populares</h2>
        <CategoryGrid />
      </section>

      <section className="my-8">
        <h2 className="text-2xl font-bold mb-4">Productos recientes en Electrónica</h2>
        <ProductCarousel category="electronics" />
      </section>

      <section className="my-8">
        <h2 className="text-2xl font-bold mb-4">Ofertas del día</h2>
        <SpecialOffers />
      </section>

      <section className="my-8">
        <h2 className="text-2xl font-bold mb-4">Productos recientes en Hogar</h2>
        <ProductCarousel category="home" />
      </section>

      <section className="my-8">
        <h2 className="text-2xl font-bold mb-4">Productos recientes en Moda</h2>
        <ProductCarousel category="fashion" />
      </section>

      <section className="my-8">
        <h2 className="text-2xl font-bold mb-4">Productos recientes en Libros</h2>
        <ProductCarousel category="books" />
      </section>

      <section className="my-8">
        <h2 className="text-2xl font-bold mb-4">Productos recientes en Deportes</h2>
        <ProductCarousel category="sports" />
      </section>
    </div>
  )
}
