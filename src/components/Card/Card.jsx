import { Link } from "react-router-dom";
import CardButton from "./CardButton";

export default function Card({id , poster}) {
  return (
    <Link
      to={`/items/${id}`}
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
        backgroundImage: `url(${poster})`,
      }}
    >
      <CardButton />
    </Link>
  );
}