import { Link } from "react-router-dom"

export default function listItem({href , title}) {
  return (
    <Link to={href}>
        <li>{title}</li>
    </Link>
  )
}
