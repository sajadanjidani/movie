import useEmblaCarousel from "embla-carousel-react";
import Card from "../Card/Card";

import { useCategorySlider } from "../../context/CategorySliderContext";

export default function CardSlider({ items = [] }) {
  const { categories } = useCategorySlider();

  const [emblaRef] = useEmblaCarousel({
    loop: false,
    dragFree: false,
  });

  const filteredItems =
    categories.length === 0
      ? items
      : items.filter((item) =>
          item.genres?.some((genre) =>
            categories.some(
              (category) =>
                category.toLowerCase() === genre.toLowerCase()
            )
          )
        );

  return (
    <div ref={emblaRef} className="overflow-hidden">
      <div className="flex mt-5 gap-10">
        {filteredItems.map((item) => (
          <Card key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
}