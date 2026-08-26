import { Link } from "react-router-dom";
import { HeroDatas } from "../../pages/Home/data/HeroDatas";
import CardButton from "./CardButton";

export default function Card() {
  return (
    <Link
      to="/items"
      draggable={false}
      className="
        min-w-50
        h-72
        rounded-2xl
        bg-cover
        bg-center
        bg-no-repeat
        relative
        select-none
      "
      style={{
        backgroundImage: `url(${HeroDatas[0].cover})`,
      }}
    >
      <CardButton />
    </Link>
  );
}