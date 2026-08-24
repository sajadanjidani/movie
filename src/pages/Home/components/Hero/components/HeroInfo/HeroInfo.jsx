import HeroContent from "./components/HeroContent"
import MovieRating from "./components/MovieRating"
import HeroActions from "./components/HeroActions"

export default function HeroInfo() {
  return (
    <div className="w-full h-full grid grid-rows-2 pt-20">
      <div className="row-start-2 px-16">
        <HeroContent />
        <MovieRating />
        <HeroActions />
      </div>
    </div>
  )
}
