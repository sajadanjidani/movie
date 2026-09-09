import useEmblaCarousel from "embla-carousel-react";
import Card from "../Card/Card";
import { useCategorySlider } from "../../context/CategorySliderContext";


export default function CardSlider({
  items = []
  
  }) {

  const {
    selectedCategories = []
  } = useCategorySlider();



  let filteredData = items;



  if (selectedCategories.length > 0) {

    filteredData = items.filter(item =>

      item.genres?.some(genre =>

        selectedCategories.some(selected =>

          genre.toLowerCase().trim() ===
          selected.toLowerCase().trim()

        )

      )

    );

  }


  filteredData =
    filteredData
      .sort(
        (a,b) =>
          b.rating - a.rating
      )
      .slice(0,10);



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
          filteredData.map(item => (

            <Card
              key={item.id}
              {...item}
            />

          ))
        }


      </div>


    </div>

  );

}