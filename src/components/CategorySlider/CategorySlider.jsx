import useEmblaCarousel from "embla-carousel-react";
import CategoryButton from "../CategoryButton/CategoryButton";

import { categoryDatas } from "../../data/categoryDatas";

export default function CategorySlider() {

  const [emblaRef] = useEmblaCarousel({
    loop: false,
    dragFree: false,
  });

  return (
    <div ref={emblaRef} className="overflow-hidden">
      <form className="flex mt-1 gap-6">

        {categoryDatas.map((category) => (
          <CategoryButton key={category.id} {...category} />
        ))}

      </form>
    </div>
  );
}