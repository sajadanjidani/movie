import { 
  useCategorySlider 
} from "../../context/CategorySliderContext";



export default function CategoryButton({
  title,
  value
}) {


  const {
    selectedCategories,
    toggleCategory
  } = useCategorySlider();



  const checked =
    selectedCategories.includes(value);



  return (

    <label
      className="
      group
      inline-block
      hover:cursor-pointer
      my-2
      text-nowrap
      "
    >


      <input

        type="checkbox"

        checked={checked}

        onChange={() =>
          toggleCategory(value)
        }

        className="sr-only"

      />



      <span

        className={`
          px-7 py-2
          border
          border-[#EC5BAA]
          rounded-4xl
          mt-3
          inline-block
          ${
            checked
            ?
            "bg-[#EC5BAA]"
            :
            ""
          }
        `}

      >

        {title}

      </span>


    </label>

  );

}