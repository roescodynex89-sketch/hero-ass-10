import ArtCategory from "@/components/home/ArtCatagory";
import Banner from "@/components/home/Banner";
import FeaturedArtworks from "@/components/home/FeaturedArtworks";
import Moving from "@/components/home/Moving";
import Testimonials from "@/components/home/Testimonials";
import WhyChoose from "@/components/home/WhyChoose";

const page = () => {
  return (
    <div>
      <Banner />
      <Moving />
      <FeaturedArtworks />
      <ArtCategory />
      <WhyChoose />
{/* artist and price plan add korbo */}
      <Testimonials />
    </div>
  );
};

export default page;
