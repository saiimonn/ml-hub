import Link from "next/link";

const Nav = () => {
  return (
    <div className = "w-full flex justify-between p-4">
      <div className="px-4">
        <Link href = "/">
                  <h1 className = "text-2xl font-bold">ML-Hub</h1>
        </Link>
      </div>
      
      <div className = "flex space-x-4 px-4">
        <Link href="/models">Models</Link>
      </div>
    </div>
  )
}

export default Nav;