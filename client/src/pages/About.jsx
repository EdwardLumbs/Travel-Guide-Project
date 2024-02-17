import Hero from "../components/heroComponent/Hero"

export default function About() {
  return (
    <div>
      <Hero
        image={"photos/about.jpg"}
        content={'Travelers creating travels for travelers'}
      />
      <div className="my-20 container flex flex-col  mx-auto px-4">
        <h1 className="text-6xl font-bold">
          Welcome to Edward'sTravelGuide
        </h1>
        <p className="mt-4 text-lg text-justify">
          At Edward'sTravelGuide, we believe that the world is meant to be explored, experienced, and cherished. Whether you're a seasoned globetrotter or an aspiring adventurer, our platform is designed to ignite your passion for travel and facilitate seamless journeys to destinations near and far.
        </p>

        <h1 className="mt-4 text-4xl font-bold">
          Our Mission        
        </h1>
        <p className="mt-4 text-lg text-justify">
          Our mission is simple: to inspire and empower travelers like you to embark on unforgettable journeys and create lasting memories. We strive to be your ultimate companion in the world of travel, offering a comprehensive platform that caters to all your needs, from planning your itinerary to discovering hidden gems along the way.        
        </p>

        <h1 className="mt-4 text-4xl font-bold">
          Why Choose Us?      
        </h1>
        <div className="mt-4 flex flex-col gap-4 text-lg text-justify">
          <p>
            Reliable Information: We are committed to providing accurate, up-to-date information to help you make informed travel decisions.
          </p>
          <p>
            User-Friendly Experience: Our platform is designed with you in mind, offering a seamless and user-friendly experience from start to finish.
          </p>
          <p>
            Passionate Community: Join our vibrant community of fellow travelers who share your love for exploration and adventure. Connect with like-minded individuals, share your travel experiences, and discover new destinations together.
          </p>
        </div>

        <h1 className="mt-4 text-4xl font-bold">
          Get Started Today       
        </h1>
        <p className="mt-4 text-lg text-justify">
          Ready to embark on your next adventure? Start exploring the world with Edward'sTravelGuide today and make every journey unforgettable.        
        </p>

      </div>
    </div>
  )
}
