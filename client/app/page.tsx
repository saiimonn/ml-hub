import Nav from "./components/nav";
import Landing from "./(pages)/Landing/page";

export default function Home() {
  return (
    <div className="min-h-screen w-full">
      <Nav />
      <Landing />
    </div>
  )
}
