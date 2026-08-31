import { createContext, useContext, useState } from "react";
import { HeroDatas } from "../pages/Home/data/HeroDatas";
import { useEffect } from "react";

const HeroContext = createContext();

export function HeroProvider({ children }) {

  const [counter,setCounter] = useState(0);

  const title = HeroDatas[counter].originalTitle;
  const description = HeroDatas[counter].plot;
  const rating = HeroDatas[counter].rating;
  const watchUrl = `https://www.imdb.com/title/${HeroDatas[counter].id}`;
  const detailsUrl = `https://www.imdb.com/title/${HeroDatas[counter].id}`;
  const image = HeroDatas[counter].bgImage;
  const cover = HeroDatas[counter].poster;

  useEffect(() => {

    const timer = setTimeout(() => {

      setCounter(prevCounter => {
        if (prevCounter >= HeroDatas.length - 1) {
          return 0;
        }
        return prevCounter + 1;
      });

    }, 5000);


    return () => clearTimeout(timer);

  }, [counter]);

  return (
    <HeroContext.Provider
      value={{
        counter,
        setCounter,
        title,
        description,
        rating,
        watchUrl,
        detailsUrl,
        image,
        cover
      }}
    >
      {children}
    </HeroContext.Provider>
  );
}


export function useHero() {
  return useContext(HeroContext);
}