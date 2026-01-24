
export default function VidBG() {
 return(
   <div className = "absolute inset-0 z-0">
     <video
       autoPlay
       loop
       muted
       playsInline
       className = "w-full h-full object-cover"
     >
       <source src = "/video/bg.mp4" type = "video/mp4"/>
     </video>
     <div className = "absolute inset-0 bg-black/40 dark:bg-black/60" />
   </div>
 ) 
}