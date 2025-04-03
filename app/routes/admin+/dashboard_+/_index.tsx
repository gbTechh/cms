import { LoaderFunctionArgs } from "@remix-run/node"

export const loader = async({request}: LoaderFunctionArgs) => {
  return null;
}

export default function DashboardAdmin() {
  return (
    ul>
        {collections.map((collection) => (
          <li key={collection.name}>
            <a href={`/admin/${collection.name}`}>{collection.name}</a>
          </li>
        ))}
      </ul>
  )
}