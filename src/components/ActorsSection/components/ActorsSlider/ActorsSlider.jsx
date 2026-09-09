import useEmblaCarousel from "embla-carousel-react";
import ActorCard from "../ActorCard/ActorCard";


export default function ActorsSlider(){
  
    const [emblaRef] =
        useEmblaCarousel({
          loop:false,
          dragFree:false,
        });

    return (

    <div
      ref={emblaRef}
      className="overflow-hidden"
    >

      <div className="flex mt-5 gap-10">

        <ActorCard />
        <ActorCard />
        <ActorCard />
        <ActorCard />
        <ActorCard />
        <ActorCard />
        <ActorCard />
        <ActorCard />
        <ActorCard />
        <ActorCard />

      </div>


    </div>

  );

}