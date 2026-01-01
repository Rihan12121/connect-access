import heroVideo from '@/assets/hero-video.mp4';

const HeroVideo = () => {
  return (
    <section className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={heroVideo} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background" />
    </section>
  );
};

export default HeroVideo;
