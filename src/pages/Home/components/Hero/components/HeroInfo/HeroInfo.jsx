import HeroContent from "./components/HeroContent"

export default function HeroInfo() {
  return (
    <div className="w-full h-full grid grid-rows-2">
      <div className="row-start-2 px-16">
        <HeroContent />
      </div>
    </div>
  )
}
