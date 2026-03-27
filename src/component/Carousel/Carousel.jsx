import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useRef, useState } from "react";
import CarouselCard from "../CarouselCard/CarouselCard";
import "./Carousel.css";

const Carousel = (props) => {
    const images = props.imagesUrl ?? [];
    const alts = props.imagesAlt ?? props.alts ?? [];

    const autoplay = useRef(
        Autoplay({
            delay: 2500,
            playOnInit: true,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
        })
    );

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState([]);

    const [emblaRef, emblaApi] = useEmblaCarousel(
        {
            loop: true,
            align: "start",
            axis: "x",
            containScroll: "trimSnaps",
            dragFree: false,
            draggable: true,
            slidesToScroll: 1,
        },
        [autoplay.current]
    );

    const onInit = useCallback((api) => {
        setScrollSnaps(api.scrollSnapList());
        setSelectedIndex(api.selectedScrollSnap());
    }, []);

    const onSelect = useCallback((api) => {
        setSelectedIndex(api.selectedScrollSnap());
    }, []);

    const scrollTo = useCallback((index) => {
        if (!emblaApi) return;
        emblaApi.scrollTo(index);
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;

        onInit(emblaApi);
        emblaApi.on("reInit", onInit);
        emblaApi.on("select", onSelect);

        return () => {
            emblaApi.off("reInit", onInit);
            emblaApi.off("select", onSelect);
        };
    }, [emblaApi, onInit, onSelect]);

    return(
        <div className="embla w-full">
            <div className="embla__viewport" ref={emblaRef}>
                <div className="embla__container">
                    {images.map((imageUrl, index) => (
                        <div className="embla__slide" key={`${imageUrl}-${index}`}>
                            <CarouselCard img={imageUrl} alt={alts[index] ?? `Imagem ${index + 1}`} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-3 flex items-center justify-center gap-2">
                {scrollSnaps.map((_, index) => (
                    <button
                        key={`dot-${index}`}
                        type="button"
                        onClick={() => scrollTo(index)}
                        aria-label={`Ir para slide ${index + 1}`}
                        className={`h-2.5 w-2.5 rounded-full transition-colors ${
                            index === selectedIndex ? "bg-deep-blue" : "bg-gray"
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Carousel;