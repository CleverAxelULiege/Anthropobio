import { useEffect, useRef, useState } from "react";
import styles from "./Timeline.module.css"
const minYear = -8_000_000;
const maxyear = new Date().getFullYear();

const events = [
    { year: minYear },
    { year: -1500000 },
    { year: -1000000 },
    { year: maxyear },
];

export default function Timeline() {

    /**
     * @type {ReturnType<typeof useState<{year:number, description:string, isBottom:boolean, id:string}[]>>}
     */
    const [events_, setEvents] = useState([]);

    /**@type {React.RefObject<HTMLDivElement>} */
    const timelineRef = useRef(null);

    /**@type {React.RefObject<HTMLDivElement>} */
    const cursorRef = useRef(null);


    const recalculateStuff = () => {
        if (!timelineRef.current) {
            throw new Error("No timeline ref");
        }

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
            marker.nextElementSibling.style.height = "";
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
                        const offset = nextMarker.rect.top !== originalPosition ? 5 : 15;
                        const direction = moveDown ? 1 : -1;
                        nextMarker.rect.y += direction * (currentMarker.rect.height + offset);
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
                    //should be the marker
                    const absOffset = Math.abs(offsetY);
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
    };

    useEffect(() => {
        /** @type {{year:number, description:string, isBottom:boolean, id:string}[]} */
        let mappedEvents = events.map((e, index) => {
            return {
                id: generateUniqueId(),
                year: e.year,
                description: "",
                isBottom: index % 2 == 0
            }
        });

        setEvents(mappedEvents);

        window.addEventListener("resize", recalculateStuff);
        return () => {
            window.removeEventListener("resize", recalculateStuff);
        }
    }, []);

    useEffect(() => {
        if (events_.length == 0)
            return;

        recalculateStuff();
    }, [events_]);


    return (
        <div className={styles.timelineContainer}>
            <div ref={timelineRef} id="timeline" className={styles.timeline}>
                <div className={styles.track}>
                    {
                        events_.map((event) => {
                            return (
                                <Event cursor={cursorRef.current} key={event.id} label={event.year} id={event.id} isBottom={event.isBottom}></Event>
                            );
                        })
                    }

                    <div ref={cursorRef} className={styles.cursor}></div>
                </div>
            </div>
        </div>
    )
}

/**
 * @param {{label:string, id:string, isBottom:boolean, cursor:HTMLElement}} props 
 * @returns 
 */
function Event(props) {
    /** @type {React.RefObject<HTMLDivElement>} */
    const ref = useRef(null);


    const positionOnTimeline = useRef(calculatePositionOnTimeline(minYear, maxyear, props.label));

    useEffect(() => {
        const labelElement = ref.current;

        /**@type {HTMLElement} */
        const timelineElement = labelElement.closest("#timeline");

        if (!timelineElement)
            throw new Error("The label doesn't have a timeline.")

        const labelRect = labelElement.getBoundingClientRect();
        const timelineRect = timelineElement.getBoundingClientRect();


        if (labelRect.left < timelineRect.left) {
            labelElement.style.left = '-2px'; //width of the red line marker
            labelElement.style.transform = 'translateX(0)';
        } else if (labelRect.right > timelineRect.right) {
            labelElement.style.left = 'auto';
            labelElement.style.right = '-2px'; //width of the red line marker
            labelElement.style.transform = 'translateX(0)';
        }


    }, []);

    const onHoverLabel = () => {
        props.cursor.style.left = `${positionOnTimeline.current}%`;
    }
    return (
        <>
            <div className={styles.event} data-event-id={props.id} style={{ left: `${positionOnTimeline.current}%` }}></div>
            <div ref={ref} onMouseEnter={() => onHoverLabel()} data-marker="" data-is-bottom={props.isBottom} className={styles.yearLabel} style={{ left: `${positionOnTimeline.current}%` }}>
                {(props.label.toString().length > 4 ? numberWithSpaces(props.label) : props.label)}
            </div>
            <div className={styles.marker} style={{ left: `${positionOnTimeline.current}%` }} id="marker"></div>
        </>


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

