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


    const recalculateStuff = () => {
        if (!timelineRef.current) {
            throw new Error("No timeline ref");
        }

        /**@type {HTMLElement[]} */
        const markers = Array.from(timelineRef.current.querySelectorAll("[data-marker]"));
        markers.forEach((marker) => {
            marker.style.bottom = `100%`;
            marker.nextElementSibling.style.height = "";
        })

        //wait for the dom to update
        markers[0].getBoundingClientRect();
        markers[0].getBoundingClientRect();

        const markersWithRect = markers.map((element) => {

            const rect = element.getBoundingClientRect();
            return {
                element: element,
                rect: rect,
                originalTop: rect.top,
                isBottom: element.getAttribute("data-is-bottom") == "true"
            }
        });

        const markersBottom = markersWithRect.filter((m) => m.isBottom);
        const markersTop = markersWithRect.filter((m) => !m.isBottom);
        

        markersWithRect.sort((a, b) => a.rect.left - b.rect.left);
        const originalTop = markersWithRect[0].originalTop;


        for (let i = 0; i < markersWithRect.length; i++) {
            const currentMarker = markersWithRect[i];

            for (let j = i + 1; j < markersWithRect.length; j++) {
                const nextMarker = markersWithRect[j];

                if (isOverlapping(currentMarker.rect, nextMarker.rect)) {

                    let offset = 15;
                    if (nextMarker.rect.top != originalTop) {
                        offset = 5;
                    }

                    nextMarker.rect.y -= currentMarker.rect.height + offset;
                }
            }
        }

        markersWithRect.forEach((markerData) => {
            const { element, rect, originalTop } = markerData;
            const offsetY = rect.top - originalTop;
            element.style.bottom = `calc(100% + 10px)`
            if (offsetY !== 0) {



                //should be the marker
                element.nextElementSibling.style.height = `${Math.abs(offsetY)}px`;

                element.style.bottom = `calc(100% + ${Math.abs(offsetY)}px)`
            }

        });
    }

    useEffect(() => {
        /** @type {{year:number, description:string, isBottom:boolean, id:string}[]} */
        let mappedEvents = events.map((e, index) => {
            return {
                id: generateUniqueId(),
                year: e.year,
                description: "",
                isBottom : index % 2 == 0
            }
        });

        setEvents(mappedEvents);

        
        // recalculateStuff();

        window.addEventListener("resize", recalculateStuff);
        return () => {
            window.removeEventListener("resize", recalculateStuff);
        }
    }, []);


    return (
        <div className={styles.timelineContainer}>
            <div ref={timelineRef} id="timeline" className={styles.timeline}>
                <div className={styles.track}>
                    {
                        events_.map((event) => {
                            return (
                                <Event key={event.id} label={event.year} id={event.id} isBottom={event.isBottom}></Event>
                            );
                        })
                    }
                </div>
            </div>
        </div>
    )
}

/**
 * @param {{label:string, id:string, isBottom:boolean}} props 
 * @returns 
 */
function Event(props) {
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
            labelElement.style.left = '-2px'; //width of the red line marker
            labelElement.style.transform = 'translateX(0)';
        } else if (labelRect.right > timelineRect.right) {
            labelElement.style.left = 'auto';
            labelElement.style.right = '-2px'; //width of the red line marker
            labelElement.style.transform = 'translateX(0)';
        }



    }, []);
    return (
        <>
            <div className={styles.event} data-event-id={props.id} style={{ left: `${calculatePositionOnTimeline(minYear, maxyear, props.label)}%` }}></div>
            <div ref={ref} data-marker="" data-is-bottom={props.isBottom} className={styles.yearLabel} style={{ left: `${calculatePositionOnTimeline(minYear, maxyear, props.label)}%` }}>
                {(props.label.toString().length > 4 ? numberWithSpaces(props.label) : props.label)}
            </div>
            <div className={styles.marker} style={{ left: `${calculatePositionOnTimeline(minYear, maxyear, props.label)}%` }} id="marker"></div>
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

