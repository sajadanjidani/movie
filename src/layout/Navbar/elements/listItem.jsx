import { Link } from "react-router-dom"

export default function ListItem({hrefLink , title}) {
  return (
    <Link to={hrefLink}>
        <li>{title}</li>
    </Link>
  )
}
