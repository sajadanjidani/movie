import useEmblaCarousel from "embla-carousel-react";
import CategoryButton from "../CategoryButton/CategoryButton";

export default function CardSlider() {

  const [emblaRef] = useEmblaCarousel({
    loop: false,
    dragFree: false,
  });

  return (
    <div ref={emblaRef} className="overflow-hidden">
      <div className="flex mt-5 gap-10">

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

      </div>
    </div>
  );
}