import { createContext, useContext, useState } from "react";

const CategorySliderContext = createContext(null);

export function CategorySliderProvider({ children }) {
  const [categories, setCategories] = useState([]);

  const toggleCategory = (category) => {
    setCategories((prevCategories) => {
      const isSelected = prevCategories.includes(category);

      if (isSelected) {
        return prevCategories.filter(
          (item) => item !== category
        );
      }

      return [...prevCategories, category];
    });
  };

  return (
    <CategorySliderContext.Provider
      value={{
        categories,
        toggleCategory,
      }}
    >
      {children}
    </CategorySliderContext.Provider>
  );
}

export function useCategorySlider() {
  const context = useContext(CategorySliderContext);

  if (!context) {
    throw new Error(
      "useCategorySlider must be used within a CategorySliderProvider"
    );
  }

  return context;
}