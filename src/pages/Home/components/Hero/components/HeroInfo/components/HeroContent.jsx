import { useHero } from "@/context/HeroContext";

export default function HeroContent() {

  const title = useHero().title
  const description = useHero().description

  return (
    <div>
        <h3 className="text-4xl font-bold">{title}</h3>
        <p className="text-sm font-semibold mt-2 w-9/10">{description}</p>
    </div>
  )
}
