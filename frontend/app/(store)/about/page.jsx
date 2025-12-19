"use client";
export default function AboutPage() {
  return (
    <div className="bg-[#FAF3E7] min-h-screen text-[#5A2F16]">

      {/* Hero Section */}
      <section className="relative h-[320px] flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.pexels.com/photos/4109994/pexels-photo-4109994.jpeg')",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative text-center text-white px-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-wide">
            About Us
          </h1>
          <p className="mt-3 text-gray-200 max-w-2xl mx-auto">
            Crafting timeless pieces with love, tradition, and pure artistry.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-16 leading-relaxed text-lg">

        {/* Section 1 */}
        <div className="mb-14">
          <h2 className="text-3xl font-bold mb-5">Our Story</h2>
          <p>
            We are dedicated to reviving India’s traditional craftsmanship by
            bringing handcrafted brass, copper, and kansa products to modern
            homes. Every item we create represents rich heritage, exceptional
            artistry, and sustainable living.
          </p>
        </div>

        {/* Section 2 */}
        <div className="mb-14">
          <h2 className="text-3xl font-bold mb-5">Why We Started</h2>
          <p>
            Our mission began with a simple belief — that handcrafted metalware
            deserves a place in every household. We work closely with local
            artisans, empowering them with fair wages, recognition, and a
            platform to showcase their incredible skill.
          </p>
        </div>

        {/* Section 3 */}
        <div className="mb-14">
          <h2 className="text-3xl font-bold mb-5">Our Vision</h2>
          <p>
            We envision a world where traditional art forms remain alive through
            thoughtful design, ethical production, and conscious living. Our
            products are crafted to last generations — both beautiful and
            functional.
          </p>
        </div>

        {/* Section 4 */}
        <div className="mb-14">
          <h2 className="text-3xl font-bold mb-5">What Makes Us Unique</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>Handmade by skilled artisans</li>
            <li>Eco-friendly & sustainable materials</li>
            <li>Premium quality with timeless designs</li>
            <li>Fair trade practices & artisan empowerment</li>
          </ul>
        </div>

        {/* Quote */}
        <div className="bg-[#BB6F1B] text-white px-8 py-10 rounded-xl text-center shadow-lg">
          <p className="text-xl italic">
            "Craftsmanship is not just a skill — it is a legacy passed through
            generations."
          </p>
        </div>
          
      </div>
    </div>
  );
}
