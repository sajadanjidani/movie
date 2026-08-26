import useEmblaCarousel from "embla-carousel-react";
import CategoryButton from "../CategoryButton/CategoryButton";

export default function CategorySlider() {

  const [emblaRef] = useEmblaCarousel({
    loop: false,
    dragFree: false,
  });

  return (
    <div ref={emblaRef} className="overflow-hidden">
      <form className="flex mt-1 gap-6">

        <CategoryButton />
        <CategoryButton />
        <CategoryButton />
        <CategoryButton />
        <CategoryButton />
        <CategoryButton />
        <CategoryButton />
        <CategoryButton />
        <CategoryButton />
        <CategoryButton />

      </form>
    </div>
  );
}