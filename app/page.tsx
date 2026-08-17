import FeaturedProducts from "@/components/home/FeaturedProd";
import HeroSection from "@/components/home/Hero";
import PromoSection from "@/components/home/PromoSection";
import TeamSection from "@/components/home/TeamSection";
import Updates from "@/components/home/Updates";
import VideoSection from "@/components/home/VideoSection";


export default function Home() {
  return <>
    <HeroSection />
    <FeaturedProducts />
    <PromoSection />
    <TeamSection />
    <VideoSection />
    <Updates />
  </>
}