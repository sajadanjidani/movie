import { Link } from "react-router-dom";

export default function ActorCard({id , poster}) {
  return (
    <Link
      to={`/items/${id}`}
      draggable={false}
      className="
        min-w-38
        h-38
        rounded-full
        bg-cover
        bg-center
        bg-no-repeat
        relative
        select-none
        bg-red-600
      "
      style={{
        backgroundImage: `url(${poster})`,
      }}
    >
    </Link>
  );
}