import { useHero } from "@/context/HeroContext";

export default function HeroContent() {

  const title = useHero().title
  const description = useHero().description

  return (
    <div>
        <h3 className="md:text-4xl sm:text-3xl text-xl font-bold">{title}</h3>
        <p className="sm:text-sm text-xs text-wrap font-semibold mt-2 w-11/12 h-20">{description}</p>
    </div>
  )
}
