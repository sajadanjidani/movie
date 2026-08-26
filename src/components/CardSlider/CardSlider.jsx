import useEmblaCarousel from "embla-carousel-react";
import Card from '../Card/Card'

export default function CardSlider() {

  const [emblaRef] = useEmblaCarousel({
    loop: false,
    dragFree: false,
  });

  return (
    <div ref={emblaRef} className="overflow-hidden">
      <div className="flex mt-8 gap-10">

        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />

      </div>
    </div>
  );
}