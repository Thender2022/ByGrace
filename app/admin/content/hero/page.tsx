// app/admin/content/hero/page.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

type SlideshowImage = {
  id: string;
  title: string;
  imageUrl: string;
  description: string | null;
  category: {
    id: string;
    name: string;
  } | null;
  tags: string[];
  isActive: boolean;
  isSlideshow: boolean;
  createdAt: string;
};

// Fetch function outside component
const fetchImages = async () => {
  try {
    const res = await fetch("/api/images");
    const data = await res.json();
    if (res.ok) {
      return { images: data.images || [], slideshowImages: data.images?.filter((img: SlideshowImage) => img.isSlideshow) || [] };
    }
    return { images: [], slideshowImages: [] };
  } catch (error) {
    console.error("Error fetching images:", error);
    return { images: [], slideshowImages: [] };
  }
};

export default function HeroSlideshowManager() {
  const [images, setImages] = useState<SlideshowImage[]>([]);
  const [slideshowImages, setSlideshowImages] = useState<SlideshowImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const MAX_SLIDES = 5; // Hard limit

  // Load images on mount
  useEffect(() => {
    const loadImages = async () => {
      setLoading(true);
      const data = await fetchImages();
      setImages(data.images);
      setSlideshowImages(data.slideshowImages);
      setLoading(false);
    };
    
    loadImages();
  }, []);

  // Auto-slideshow for preview
  useEffect(() => {
    if (!isPreviewOpen || slideshowImages.length <= 1) return;

    const timer = setInterval(() => {
      setPreviewIndex((prevIndex) => 
        prevIndex === slideshowImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(timer);
  }, [isPreviewOpen, slideshowImages.length]);

  // Add image to slideshow - ENFORCE 5 IMAGE LIMIT
  const addToSlideshow = async (imageId: string) => {
    // Check if max is reached BEFORE making API call
    if (slideshowImages.length >= MAX_SLIDES) {
      setMessage({ 
        text: `⚠️ Maximum of ${MAX_SLIDES} slides reached. Please remove an image first.`, 
        type: "error" 
      });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    try {
      const res = await fetch(`/api/images/${imageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isSlideshow: true }),
      });

      if (res.ok) {
        setMessage({ text: "✅ Image added to slideshow", type: "success" });
        const data = await fetchImages();
        setImages(data.images);
        setSlideshowImages(data.slideshowImages);
        setTimeout(() => setMessage(null), 3000);
      } else {
        const error = await res.json();
        setMessage({ text: `❌ ${error.error || "Failed to add image"}`, type: "error" });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      setMessage({ text: "❌ Failed to add to slideshow", type: "error" });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // Remove image from slideshow
  const removeFromSlideshow = async (imageId: string) => {
    try {
      const res = await fetch(`/api/images/${imageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isSlideshow: false }),
      });

      if (res.ok) {
        setMessage({ text: "✅ Image removed from slideshow", type: "success" });
        const data = await fetchImages();
        setImages(data.images);
        setSlideshowImages(data.slideshowImages);
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      setMessage({ text: "❌ Failed to remove from slideshow", type: "error" });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // Reorder images
  const moveImage = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= slideshowImages.length) return;

    const reordered = [...slideshowImages];
    [reordered[index], reordered[newIndex]] = [reordered[newIndex], reordered[index]];
    setSlideshowImages(reordered);
  };

  const availableImages = images.filter(img => !img.isSlideshow && img.isActive);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto text-center py-12 text-gray-500 font-light">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-light tracking-[0.2em] uppercase">🎯 Hero Slideshow Manager</h1>
          <p className="text-sm text-gray-500 font-light mt-1">
            Manage which images appear in the hero section slideshow
          </p>
          <div className="flex items-center gap-3 mt-2">
            <span className={`text-xs font-light px-3 py-1 rounded-full ${
              slideshowImages.length >= MAX_SLIDES 
                ? 'bg-red-100 text-red-700' 
                : 'bg-green-100 text-green-700'
            }`}>
              {slideshowImages.length} / {MAX_SLIDES} slides used
            </span>
            {slideshowImages.length >= MAX_SLIDES && (
              <span className="text-xs text-red-600 font-light">
                ⚠️ Maximum of {MAX_SLIDES} images reached
              </span>
            )}
            {slideshowImages.length < MAX_SLIDES && (
              <span className="text-xs text-gray-500 font-light">
                {MAX_SLIDES - slideshowImages.length} slots remaining
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Live Preview Button */}
          <button
            onClick={() => {
              setPreviewIndex(0);
              setIsPreviewOpen(true);
            }}
            disabled={slideshowImages.length === 0}
            className={`px-6 py-2.5 transition-colors text-sm font-light tracking-wider uppercase ${
              slideshowImages.length === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg'
            }`}
          >
            🖥️ Live Preview
          </button>
          <Link
            href="/admin/content/images/new"
            className="bg-gold-500 text-black px-6 py-2.5 hover:bg-gold-400 transition-colors text-sm font-light tracking-wider uppercase text-center"
          >
            + Upload New Image
          </Link>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-4 mb-6 rounded border ${
            message.type === "success" ? "bg-green-100 border-green-300" : "bg-red-100 border-red-300"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Mini Preview Section */}
      {slideshowImages.length > 0 && (
        <div className="mb-8 bg-gray-50 rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-light tracking-[0.1em] uppercase text-gray-600">Live Preview</h3>
            <button
              onClick={() => {
                setPreviewIndex(0);
                setIsPreviewOpen(true);
              }}
              className="text-xs text-green-600 hover:text-green-800 font-light"
            >
              Click to expand →
            </button>
          </div>
          <div className="relative w-full h-[120px] rounded-lg overflow-hidden bg-gray-900">
            {slideshowImages.map((image, index) => (
              <div
                key={image.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === 0 ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <Image
                  src={image.imageUrl}
                  alt={image.title}
                  fill
                  className="object-cover object-center"
                  sizes="100vw"
                />
              </div>
            ))}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="text-center">
                <p className="text-white/80 text-xs font-light tracking-wider uppercase">
                  {slideshowImages.length} of {MAX_SLIDES} images • Click to Preview
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Current Slideshow Images */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-lg font-light tracking-[0.15em] uppercase">Active Slideshow Images</h2>
          <span className="text-sm text-gray-500 font-light">
            ({slideshowImages.length} of {MAX_SLIDES} max)
          </span>
        </div>

        {slideshowImages.length === 0 ? (
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <p className="text-gray-500 font-light">No images in slideshow yet.</p>
            <p className="text-gray-400 text-sm font-light mt-1">
              Add up to {MAX_SLIDES} images from the Available Images section below.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {slideshowImages.map((image, index) => (
              <div
                key={image.id}
                className="bg-white rounded-lg shadow-sm border border-gold-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-[16/9] bg-gray-100 relative">
                  <Image
                    src={image.imageUrl}
                    alt={image.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-gold-500 text-black text-xs px-2 py-1 rounded font-light tracking-wider uppercase">
                    Slide {index + 1}
                  </div>
                  <div className="absolute top-2 right-2 flex gap-1">
                    {index > 0 && (
                      <button
                        onClick={() => moveImage(index, "up")}
                        className="bg-black/70 text-white p-1.5 rounded hover:bg-black transition-colors"
                        title="Move up"
                      >
                        ↑
                      </button>
                    )}
                    {index < slideshowImages.length - 1 && (
                      <button
                        onClick={() => moveImage(index, "down")}
                        className="bg-black/70 text-white p-1.5 rounded hover:bg-black transition-colors"
                        title="Move down"
                      >
                        ↓
                      </button>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-light text-gray-900 text-sm truncate">{image.title}</h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{image.description || "No description"}</p>
                  <button
                    onClick={() => removeFromSlideshow(image.id)}
                    className="mt-3 w-full text-sm bg-red-100 text-red-700 px-3 py-1.5 hover:bg-red-200 transition-colors rounded"
                  >
                    🗑️ Remove from Slideshow
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available Images */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-lg font-light tracking-[0.15em] uppercase">Available Images</h2>
          <span className="text-sm text-gray-500 font-light">
            ({availableImages.length} available)
          </span>
        </div>

        {availableImages.length === 0 ? (
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <p className="text-gray-500 font-light">No available images to add.</p>
            <p className="text-gray-400 text-sm font-light mt-1">
              Upload new images or check if images are active.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {availableImages.map((image) => (
              <div
                key={image.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-square bg-gray-100 relative">
                  <Image
                    src={image.imageUrl}
                    alt={image.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-light text-gray-900 text-sm truncate">{image.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{image.category?.name || "Uncategorized"}</p>
                  {slideshowImages.length >= MAX_SLIDES ? (
                    <div className="mt-3 w-full text-sm bg-gray-100 text-gray-400 px-3 py-1.5 rounded text-center">
                      🔒 Max {MAX_SLIDES} slides reached
                    </div>
                  ) : (
                    <button
                      onClick={() => addToSlideshow(image.id)}
                      className="mt-3 w-full text-sm bg-gold-500 text-black px-3 py-1.5 hover:bg-gold-400 transition-colors rounded"
                    >
                      ➕ Add to Slideshow
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FULL-SCREEN LIVE PREVIEW MODAL */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <div className="relative w-full h-full">
            <button
              onClick={() => setIsPreviewOpen(false)}
              className="absolute top-4 right-4 z-20 text-white hover:text-gray-300 transition-colors text-2xl bg-black/50 rounded-full w-10 h-10 flex items-center justify-center"
            >
              ✕
            </button>

            <div className="absolute top-4 left-4 z-20 bg-black/70 text-white text-xs px-3 py-1 rounded-full font-light">
              🖥️ Live Preview
            </div>

            <section className="relative h-[85vh] min-h-[600px] md:min-h-[700px] lg:h-[90vh] w-full flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 z-0">
                {slideshowImages.map((image, index) => (
                  <div
                    key={image.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ${
                      index === previewIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={image.imageUrl}
                        alt={image.title || 'ByGrace Skate Team'}
                        fill
                        className="object-cover object-center"
                        priority={index === 0}
                        sizes="100vw"
                        loading={index === 0 ? "eager" : "lazy"}
                        quality={90}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/squad.jpeg';
                        }}
                      />
                    </div>
                  </div>
                ))}
                <div className="absolute inset-0 bg-black/50 md:bg-black/40" />
              </div>
              
              <div className="relative z-10 text-center px-6 sm:px-8 max-w-4xl">
                <div className="inline-block mb-6 md:mb-8 px-4 md:px-6 py-1.5 md:py-2 border border-white/20 rounded-full backdrop-blur-sm">
                  <span className="text-[10px] md:text-xs font-light tracking-[0.2em] md:tracking-[0.3em] uppercase text-white/80">
                    Established 2025
                  </span>
                </div>
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-[0.1em] md:tracking-[0.15em] text-white uppercase leading-[1.1]">
                  By Grace
                </h1>
                <p className="text-white/70 font-light tracking-[0.15em] md:tracking-[0.25em] mt-4 md:mt-5 text-xs md:text-sm uppercase">
                  Premium skateboards · Apparel
                </p>
                <div className="w-10 md:w-12 h-px bg-white/40 mx-auto mt-6 md:mt-7" />
                <p className="text-white/60 font-light tracking-wider mt-4 md:mt-6 text-sm md:text-base max-w-xl mx-auto leading-relaxed px-4">
                  We Are Graceful We Are Grateful.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mt-8 md:mt-10">
                  <span className="w-full sm:w-auto px-8 md:px-10 py-3 md:py-3.5 bg-white text-black hover:bg-white/90 transition-all duration-300 font-light tracking-[0.15em] md:tracking-[0.2em] uppercase text-xs md:text-sm cursor-default">
                    Shop Collection
                  </span>
                  <span className="w-full sm:w-auto px-8 md:px-10 py-3 md:py-3.5 border border-white/40 text-white hover:bg-white hover:text-black transition-all duration-300 font-light tracking-[0.15em] md:tracking-[0.2em] uppercase text-xs md:text-sm cursor-default">
                    Explore Content
                  </span>
                </div>
              </div>

              {slideshowImages.length > 1 && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                  {slideshowImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setPreviewIndex(index)}
                      className={`transition-all duration-300 rounded-full ${
                        index === previewIndex 
                          ? 'w-8 h-2 bg-white' 
                          : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}

              {slideshowImages.length > 1 && (
                <>
                  <button
                    onClick={() => setPreviewIndex(prev => prev === 0 ? slideshowImages.length - 1 : prev - 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white/70 hover:text-white text-4xl transition-colors bg-black/30 rounded-full w-12 h-12 flex items-center justify-center"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => setPreviewIndex(prev => prev === slideshowImages.length - 1 ? 0 : prev + 1)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white/70 hover:text-white text-4xl transition-colors bg-black/30 rounded-full w-12 h-12 flex items-center justify-center"
                  >
                    ›
                  </button>
                </>
              )}

              {slideshowImages.length > 1 && (
                <div className="absolute bottom-8 right-8 z-10 bg-black/70 text-white text-sm px-4 py-2 rounded-full font-light">
                  {previewIndex + 1} / {slideshowImages.length}
                </div>
              )}
            </section>
          </div>
        </div>
      )}
    </div>
  );
}