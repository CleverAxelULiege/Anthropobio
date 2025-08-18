import { useEffect, useRef, useState } from "react";
import styles from "./Timeline.module.css"
const minYear = -8_000_000;
const maxyear = new Date().getFullYear();

const events = [
    { year: minYear },
    { year: -1500000 },
    { year: -1500000 },
    { year: -1000000 },
    { year: maxyear },
];

/**
 * 
 * @param {{setNewEvent: React.RefObject<(year:string, description:string, imgUrl:string) => void>}} props 
 * @returns 
 */
export default function Timeline(props) {

    /**
     * @type {ReturnType<typeof useState<{imgUrl:string|null, year:number, description:string, isBottom:boolean, id:string}[]>>}
     */
    const [events_, setEvents] = useState([]);

    /**@type {React.RefObject<HTMLDivElement>} */
    const timelineRef = useRef(null);

    /**@type {React.RefObject<HTMLDivElement>} */
    const slideshowTimelineRef = useRef(null);

    /**@type {React.RefObject<HTMLDivElement>} */
    const cursorRef = useRef(null);

    /**@type {React.RefObject<string>} */
    const previousLabelIdClicked = useRef("");

    const onClickLabel = (id, year, positionTimeline) => {
        setCursorPositon(positionTimeline)

        const eventElements = timelineRef.current.querySelectorAll("[data-event-id]");
        if (previousLabelIdClicked.current == id) {
            eventElements.forEach((element) => {
                element.classList.add(styles.active);
            });
            previousLabelIdClicked.current = "";
            return;
        }

        eventElements.forEach((element) => {
            if (element.getAttribute("data-event-id") == id) {
                element.classList.add(styles.active);
            } else {
                element.classList.remove(styles.active);
            }
        });

        showSlideFromId(id);

        previousLabelIdClicked.current = id;
    }

    const onMouseHoverLabel = (id, year, positionTimeline) => {
        //has clicked / locked a label
        if (previousLabelIdClicked.current != "")
            return;
        setCursorPositon(positionTimeline)

        showSlideFromId(id);

    }

    const showSlideFromId = (id) => {
        const slide = slideshowTimelineRef.current.querySelector(`[data-slide-event-id="${id}"]`);
        if (!slide)
            return;

        const indexSlide = parseInt(slide.getAttribute("data-index"));

        if (isNaN(indexSlide))
            return;

        slideshowTimelineRef.current.style.transform = `translate3d(-${indexSlide * 100}%, 0px, 0px)`;
    }

    const setCursorPositon = (position) => {
        cursorRef.current.style.left = `${position}%`;
    }




    const recalculateStuff = () => {
        if (!timelineRef.current) {
            throw new Error("No timeline ref");
        }

        const timelineRect = timelineRef.current.getBoundingClientRect();

        //Reset everything before calculating its height/new position and override what's on the CSS.
        /**@type {HTMLElement[]} */
        const markers = Array.from(timelineRef.current.querySelectorAll("[data-marker]"));

        // Reset marker positions
        markers.forEach((marker) => {
            if (marker.getAttribute("data-is-bottom") == "true") {
                marker.style.top = `100%`;
            } else {
                marker.style.bottom = `100%`;
            }
            //the red vertical bar
            marker.nextElementSibling.style.height = "";

            //prevent overflowing on the side by recalculating its position
            const labelRect = marker.getBoundingClientRect();
            if (labelRect.left < timelineRect.left) {
                marker.style.left = '-2px'; //width of the red line marker
                marker.style.transform = 'translateX(0)';
            } else if (labelRect.right > timelineRect.right) {
                marker.style.left = 'auto';
                marker.style.right = '-2px'; //width of the red line marker
                marker.style.transform = 'translateX(0)';
            }
        });

        //wait for the dom to update
        markers[0].getBoundingClientRect();

        // Create marker data with rectangles
        const markersWithRect = markers.map((element) => {
            const rect = element.getBoundingClientRect();
            return {
                element: element,
                rect: rect,
                originalTop: rect.top,
                isBottom: element.getAttribute("data-is-bottom") == "true"
            };
        });

        // Separate and sort markers
        const markersBottom = markersWithRect.filter((m) => m.isBottom).sort((a, b) => a.rect.left - b.rect.left);
        const markersTop = markersWithRect.filter((m) => !m.isBottom).sort((a, b) => a.rect.left - b.rect.left);

        const originalTop = markersTop[0].originalTop;
        const originalBottom = markersBottom[0].originalTop;

        // Helper function to resolve overlaps
        const resolveOverlaps = (markersList, originalPosition, moveDown = false) => {
            for (let i = 0; i < markersList.length; i++) {
                const currentMarker = markersList[i];
                for (let j = i + 1; j < markersList.length; j++) {
                    const nextMarker = markersList[j];
                    if (isOverlapping(currentMarker.rect, nextMarker.rect)) {

                        const offset = nextMarker.rect.top !== originalPosition ? 15 : 15;
                        const direction = moveDown ? 1 : -1;
                        nextMarker.rect.y += direction * (Math.max(nextMarker.rect.height, currentMarker.rect.height) + offset);
                    }
                }
            }
        };

        // Resolve overlaps for both marker types
        resolveOverlaps(markersTop, originalTop, false);
        resolveOverlaps(markersBottom, originalBottom, true);

        // Helper function to apply positioning
        const applyPositioning = (markersList, isBottom = false) => {
            markersList.forEach((markerData) => {
                const { element, rect, originalTop } = markerData;
                const offsetY = rect.top - originalTop;
                const basePosition = `calc(100% + 10px)`;

                if (isBottom) {
                    element.style.top = basePosition;
                } else {
                    element.style.bottom = basePosition;
                }

                if (offsetY !== 0) {

                    const absOffset = Math.abs(offsetY);
                    //the red vertical bar
                    element.nextElementSibling.style.height = `${absOffset}px`;

                    if (isBottom) {
                        element.style.top = `calc(100% + ${absOffset}px)`;
                    } else {
                        element.style.bottom = `calc(100% + ${absOffset}px)`;
                    }
                }
            });
        };

        // Apply positioning to both marker types
        applyPositioning(markersTop, false);
        applyPositioning(markersBottom, true);

        const calculateRequiredHeight = () => {
            let maxTopExtent = 0;
            let maxBottomExtent = 0;

            // Calculate maximum extent above timeline (top markers)
            markersTop.forEach((markerData) => {
                const { rect, originalTop } = markerData;
                const offsetY = rect.top - originalTop;
                const markerHeight = rect.height;
                const totalExtent = Math.abs(offsetY) + markerHeight + 10; // 10px base offset
                maxTopExtent = Math.max(maxTopExtent, totalExtent);
            });

            // Calculate maximum extent below timeline (bottom markers)
            markersBottom.forEach((markerData) => {
                const { rect, originalTop } = markerData;
                const offsetY = rect.top - originalTop;
                const markerHeight = rect.height;
                const totalExtent = Math.abs(offsetY) + markerHeight + 10; // 10px base offset
                maxBottomExtent = Math.max(maxBottomExtent, totalExtent);
            });

            const topHeight = maxTopExtent;
            const bottomHeight = maxBottomExtent;

            const requiredHeight = Math.max(topHeight, bottomHeight) * 2;
            return requiredHeight;


        };

        const padding = 10;
        timelineRef.current.style.minHeight = `${calculateRequiredHeight() + 2 * padding}px`;
    };

    useEffect(() => {
        /** @type {{year:number, description:string, isBottom:boolean, id:string}[]} */
        let mappedEvents = events.map((e, index) => {
            return {
                id: generateUniqueId(),
                year: e.year,
                description: "lorem ipsum test",
                isBottom: index % 2 == 0,
                imgUrl: null,
            }
        });

        setEvents(mappedEvents);
        props.setNewEvent.current = setNewEvent;

        window.addEventListener("resize", recalculateStuff);
        return () => {
            window.removeEventListener("resize", recalculateStuff);
        }
    }, []);

    const setNewEvent = (year, description, imgUrl) => {
        //replace every non digit or negative sign with a blank
        year = year.toString().replace(/[^\d-]/g, "");
        year = parseInt(year);
        if (isNaN(year)) {
            year = new Date().getFullYear();
        }


        const id = generateUniqueId();

        setEvents((prevEvents) => {
            const tempEvents = prevEvents.filter((event) => event.imgUrl == null);
            tempEvents.push({ id: id, description: description, imgUrl: imgUrl, isBottom: false, year: year });
            return tempEvents;
        });

        setTimeout(() => {
            //event element on timeline
            const eventElement = timelineRef.current.querySelector(`[data-event-id="${id}"]`);

            const slideEvent = slideshowTimelineRef.current.querySelector(`[data-slide-event-id="${id}"]`);

            setCursorPositon(eventElement.querySelector("." + styles.event).style.left.replace(/[^\d-]/g, ""));
            
            
            
        }, 1500);
    };

    useEffect(() => {
        if (events_.length == 0) return;

        const isSorted = events_.every((e, i, arr) => i == 0 || arr[i - 1].year <= e.year);
        if (!isSorted) {
            const sortedEvents = [...events_].sort((a, b) => a.year - b.year);
            setEvents(sortedEvents);
        } else {
            recalculateStuff();
        }
    }, [events_]);

    return (
        <>
            <div className={styles.timelineContainer}>
                <div ref={timelineRef} id="timeline" className={styles.timeline}>
                    <div className={styles.track}>
                        {
                            events_.map((event) => {
                                return (
                                    <Event recalculateStuff={recalculateStuff} onMouseHoverLabel={onMouseHoverLabel} onClickLabel={onClickLabel} cursor={cursorRef.current} key={event.id} label={event.year} id={event.id} isBottom={event.isBottom} imgUrl={event.imgUrl}></Event>
                                );
                            })
                        }

                        <div ref={cursorRef} className={styles.cursor}></div>
                    </div>
                </div>
            </div>

            <div className={styles.slideshowContainer}>
                <div className={styles.slideshowWrapper}>
                    <div ref={slideshowTimelineRef} className={styles.slideshowTrack}>

                        {
                            events_.map((event, index) => {
                                return (
                                    <div key={index} data-index={index} data-slide-event-id={event.id} className={styles.slideShowSlide}>
                                        {
                                            event.imgUrl == null
                                                ? <div className={styles.year}>{event.year.toString().length > 4 ? numberWithSpaces(event.year) : event.year}</div>
                                                : <div style={{ backgroundImage: `url("/tinyImg/${event.imgUrl}.png")` }} className={styles.year}><span className={styles.blur}>{event.year.toString().length > 4 ? numberWithSpaces(event.year) : event.year}</span></div>
                                        }

                                        <div className={styles.description}>{event.description}</div>
                                    </div>
                                );
                            })
                        }


                    </div>
                </div>
            </div>
        </>
    )
}

/**
 * @param { {recalculateStuff:any, label:string, id:string, isBottom:boolean, imgUrl:string|null, cursor:HTMLElement, onClickLabel : (id:string, year:number|string, positionTimeline:number) => void, onMouseHoverLabel : (id:string, year:number|string, positionTimeline:number) => void}} props 
 * @returns 
 */
function Event(props) {
    const positionOnTimeline = useRef(calculatePositionOnTimeline(minYear, maxyear, props.label));

    return (
        <div data-event-id={props.id} className={styles.eventContainer + " " + styles.active}>
            <div className={styles.event} style={{ left: `${positionOnTimeline.current}%` }}></div>
            <div onClick={() => { props.onClickLabel(props.id, props.label, positionOnTimeline.current) }} onMouseEnter={() => props.onMouseHoverLabel(props.id, props.label, positionOnTimeline.current)} data-marker={props.label} data-is-bottom={props.isBottom} className={styles.yearLabel} style={{ left: `${positionOnTimeline.current}%` }}>
                {
                    props.imgUrl &&
                    <div className={styles.labelImgContainer}>
                        <img onLoad={() => props.recalculateStuff()} src={`/tinyImg/${props.imgUrl}.png`} />
                    </div>
                }
                <div>{(props.label.toString().length > 4 ? numberWithSpaces(props.label) : props.label)}</div>
            </div>
            <div className={styles.marker} style={{ left: `${positionOnTimeline.current}%` }} id="marker"></div>
        </div>


    )
}

/**
 * @param {number} minYear 
 * @param {number} maxYear 
 * @param {number} year 
 */
function calculatePositionOnTimeline(minYear, maxYear, year) {
    return ((year - (minYear)) / (maxYear - (minYear))) * 100;
}

function isOverlapping(rect1, rect2) {
    return !(rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom);
}

function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function numberWithSpaces(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

