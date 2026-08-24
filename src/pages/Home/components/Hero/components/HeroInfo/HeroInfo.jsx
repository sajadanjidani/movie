import HeroContent from "./components/HeroContent"
import MovieRating from "./components/MovieRating"

export default function HeroInfo() {
  return (
    <div className="w-full h-full grid grid-rows-2">
      <div className="row-start-2 px-16">
        <HeroContent />
        <MovieRating />
      </div>
    </div>
  )
}
