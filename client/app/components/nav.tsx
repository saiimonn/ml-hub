import Link from "next/link";

const Nav = () => {
  return (
    <div className = "w-full flex justify-between p-4">
      <div className = "px-4">
        <h1 className = "text-2xl font-bold">ML-Hub</h1>
      </div>
      
      <div className = "flex space-x-4 px-4">
        <Link href="/Models">Models</Link>
        <Link href="/L1">Features</Link>
        <Link href = "/L1">How it Works</Link>
      </div>
    </div>
  )
}

export default Nav;