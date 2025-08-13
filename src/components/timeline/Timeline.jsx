import { useEffect, useRef } from "react";
import styles from "./Timeline.module.css"
const minYear = -8_000_000;
const maxyear = new Date().getFullYear();
export default function Timeline() {

    /**@type {React.RefObject<HTMLDivElement>} */
    const timelineRef = useRef(null);

    const events = [
        { year: minYear },
        { year: -1500000 },
        { year: -1000000 },
        { year: maxyear },
    ];

    useEffect(() => {
        function correctOverlappingMarkers() {
            if (!timelineRef.current) {
                throw new Error("No timeline ref");
            }

            /**@type {HTMLElement[]} */
            const markers = Array.from(timelineRef.current.querySelectorAll("[data-marker]"));
            const markersWithRect = markers.map((element) => {
                const rect = element.getBoundingClientRect();
                return {
                    element: element,
                    rect: rect,
                    originalTop: rect.top
                }
            });

            let foundCollision = true;
            const gapBetweenTimelineAndLabel = 10;

            while (foundCollision) {
                foundCollision = false;

                for (let i = 0; i < markersWithRect.length; i++) {
                    const currentMarker = markersWithRect[i];

                    for (let j = 0; j < markersWithRect.length; j++) {
                        if (i === j) continue; // skip comparing the marker with itself

                        const otherMarker = markersWithRect[j];

                        if (isOverlapping(currentMarker.rect, otherMarker.rect)) {
                            foundCollision = true;

                            // Move the lower marker downward to resolve overlap
                            if (otherMarker.rect.top >= currentMarker.rect.top) {
                                otherMarker.rect.y += currentMarker.rect.height + gapBetweenTimelineAndLabel;
                            } else {
                                currentMarker.rect.y += otherMarker.rect.height + gapBetweenTimelineAndLabel;
                            }
                        }
                    }
                }
            }


            markersWithRect.forEach((markerData) => {
                const { element, rect, originalTop } = markerData;
                const offsetY = rect.top - originalTop;

                if (offsetY !== 0) {
                    /**@type {HTMLDivElement} */
                    const marker = element.querySelector("#marker");
                    marker.style.height = `${Math.abs(offsetY)}px`;

                    element.style.bottom = `calc(100% + ${Math.abs(offsetY)}px)`
                }
            });
        }

        correctOverlappingMarkers(); // Run initially (your original effect)

        window.addEventListener('resize', correctOverlappingMarkers);

        return () => {
            window.removeEventListener('resize', correctOverlappingMarkers);
        };
    }, []);


    return (
        <div className={styles.timelineContainer}>
            <div ref={timelineRef} id="timeline" className={styles.timeline}>
                <div className={styles.track}>
                    {
                        events.map((event, index) => {
                            return (
                                <YearLabel key={index} label={event.year}></YearLabel>
                            );
                        })
                    }
                </div>
            </div>
        </div>
    )
}

/**
 * @param {{label:string}} props 
 * @returns 
 */
function YearLabel(props) {
    /** @type {React.RefObject<HTMLDivElement>} */
    const ref = useRef(null);
    useEffect(() => {
        const labelElement = ref.current;

        /**@type {HTMLElement} */
        const timelineElement = labelElement.closest("#timeline");

        if (!timelineElement)
            throw new Error("The label doesn't have a timeline.")

        const labelRect = labelElement.getBoundingClientRect();
        const timelineRect = timelineElement.getBoundingClientRect();


        if (labelRect.left < timelineRect.left) {
            labelElement.style.left = '0';
            labelElement.style.transform = 'translateX(0)';
        } else if (labelRect.right > timelineRect.right) {
            labelElement.style.left = 'auto';
            labelElement.style.right = '0';
            labelElement.style.transform = 'translateX(0)';
        }



    }, []);
    return (
        <div ref={ref} data-marker="" className={styles.yearLabel} style={{ left: `${calculatePositionOnTimeline(minYear, maxyear, props.label)}%` }}>
            {props.label}
            <div className={styles.marker} id="marker"></div>
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

