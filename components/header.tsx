import { gql } from "@apollo/client";
import Link from "next/link";

interface MenuItem {
  id: string;
  uri: string;
  label: string;
}

interface HeaderProps {
  siteTitle?: string;
  siteDescription?: string;
  menuItems?: MenuItem[];
}

export default function Header({ siteTitle, siteDescription, menuItems }: HeaderProps) {
  return (
    <header className="bg-gray-800 text-white py-4">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex flex-col">
          <h2 className="text-2xl font-bold">{siteTitle}</h2>
          <p className="text-sm text-gray-400">{siteDescription}</p>
        </Link>

        <nav className="flex">
          <ul className="flex space-x-4">
            {(Array.isArray(menuItems) ? menuItems : []).map((item) => (
              <li key={item.id} className="hover:text-gray-300">
                <Link href={item.uri}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

Header.fragments = {
  entry: gql`
    fragment HeaderFragment on RootQuery {
      generalSettings {
        title
        description
      }
      primaryMenuItems: menuItems(where: { location: PRIMARY }) {
        nodes {
          id
          uri
          path
          label
          parentId
          cssClasses
          menu {
            node {
              name
            }
          }
        }
      }
    }
  `,
};

