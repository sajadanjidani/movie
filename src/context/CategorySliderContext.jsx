import {
  createContext,
  useContext,
  useState,
} from "react";


const CategorySliderContext =
  createContext(null);



export function CategorySliderProvider({ children }) {


  const [selectedCategories, setSelectedCategories] =
    useState([]);



  function toggleCategory(category) {


    setSelectedCategories((prev) => {


      if(prev.includes(category)) {

        return prev.filter(
          item => item !== category
        );

      }


      return [
        ...prev,
        category
      ];

    });

  }



  return (

    <CategorySliderContext.Provider

      value={{
        selectedCategories,
        toggleCategory
      }}

    >

      {children}

    </CategorySliderContext.Provider>

  );

}



export function useCategorySlider(){


  const context =
    useContext(CategorySliderContext);



  if(!context){

    throw new Error(
      "useCategorySlider must be used inside CategorySliderProvider"
    );

  }


  return context;

}