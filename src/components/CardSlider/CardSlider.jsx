import useEmblaCarousel from "embla-carousel-react";
import Card from '../Card/Card'

export default function CardSlider({category , items}) {

  let data = items

  const [emblaRef] = useEmblaCarousel({
    loop: false,
    dragFree: false,
  });

  return (
    <div ref={emblaRef} className="overflow-hidden">
      <div className="flex mt-5 gap-10">

        {category == 'Trends' ? (
          data.map(items => 
            <Card key={items.id} {...items}/>
          )
        ) : ''}

        {category == 'Movies' ? (
          data.map(items => 
            <Card key={items.id} {...items} />
          )
        ) : ''}

        {category == 'Series' ? (
          data.map(items => 
            <Card key={items.id} {...items} />
          )
        ) : ''}

      </div>
    </div>
  );
}