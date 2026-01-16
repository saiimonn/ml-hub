import Nav from "./components/nav";
import Landing from "./(pages)/Landing/page";
import VidBG from "./components/video-bg";

export default function Home() {
  return (
    <div className="min-h-screen w-full">
      <VidBG />
      
      <div className = "relative z-10">
        <Nav />
        <Landing />
      </div>
    </div>
  )
}
