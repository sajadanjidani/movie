import useEmblaCarousel from "embla-carousel-react";
import ActorCard from "../ActorCard/ActorCard";


export default function ActorsSlider({actorDatas}){

    let actorDatasArray = actorDatas

    console.log(actorDatasArray)

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


      {
        actorDatasArray.map((actor) => 
          <ActorCard key={actor.id} {...actor}/>
        )
      }

      </div>


    </div>

  );

}