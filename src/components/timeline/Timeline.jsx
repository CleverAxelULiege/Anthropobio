import { useEffect, useRef } from "react";
import styles from "./Timeline.module.css"
const minYear = -8_000_000;
const maxyear = new Date().getFullYear();
export default function Timeline() {

    const events = [
        { year: minYear },
        { year: maxyear },
        { year: -1000000 },
    ]

    return (
        <div className={styles.timelineContainer}>
            <div id="timeline" className={styles.timeline}>
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
        <div ref={ref} data-label="" className={styles.yearLabel} style={{ left: `${calculatePositionOnTimeline(minYear, maxyear, props.label)}%` }}>
            {props.label}
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
