import { useEffect, useRef, useState } from "react";
import { CRITERIA_WITH_ANSWERS, PRIMATES, PRIMATES_LIGHT } from "../App";
import { useAppSettings } from "../AppSettingsContext";
import Subtitle from "../components/subtitle/Subtitle";
import styles from "./Observation.module.css";
import PanelSubtitle from "../components/panelSubtitle/PanelSubtitle";

export default function Observation() {
    /**
     * @type {React.RefObject<HTMLDivElement>}
     */
    const carouselTrackRef = useRef(null);
    const [primate, setPrimate] = useState(null);

    useEffect(() => {
        if (!primate) {
            return;
        }
        carouselTrackRef.current.style.transform = "translateX(-100%)";
        document.getElementById("expert_mode_button").classList.add("hidden");
    }, [primate]);

    const onClickGoToSkullDisplay = () => {
        carouselTrackRef.current.style.transform = "";
        document.getElementById("expert_mode_button").classList.remove("hidden");
    }

    return (
        <>
            <div className="center">
                <Subtitle>
                    Cliquez sur l’un des crânes ci-dessous pour le manipuler en 3D, puis encodez les critères morphologiques que vous observez sur ce crâne afin de l’identifier.
                </Subtitle>
            </div>

            <div className={styles.carouselContainer}>
                <div className={styles.carouselWrapper}>
                    <div ref={carouselTrackRef} className={styles.carouselTrack}>

                        <div className={styles.carouselSlide}>
                            <SkullSelectionDisplay setPrimate={setPrimate}></SkullSelectionDisplay>
                        </div>

                        <div className={styles.carouselSlide}>
                            <Skull3DDislpay primate={primate} onClickGoToSkullDisplay={onClickGoToSkullDisplay}></Skull3DDislpay>
                        </div>

                    </div>
                </div>
            </div>

        </>
    )
}

function SkullSelectionDisplay({ setPrimate }) {
    const { expertMode, setExpertMode, primateId, setPrimateId } = useAppSettings();
    const [primateActive, setPrimateActive] = useState(null);

    return (
        <div className="center padding_none" style={{ maxWidth: "1900px" }}>
            <PanelSubtitle>Crânes</PanelSubtitle>
            {
                expertMode &&
                <div className={styles.skullImagesContainer}>
                    {PRIMATES.map((primate, index) => {
                        return (
                            <button key={index} className={primateActive && primateActive.fullName == primate.fullName ? styles.active : ""} onClick={() => { setPrimate(primate); setPrimateActive(primate) }}>
                                <img src={`/tinyImg/${primate.skullImgURL}.png`} />
                            </button>
                        )
                    })};
                </div>
            }
            {
                !expertMode &&
                <div className={styles.skullImagesContainer}>
                    {PRIMATES_LIGHT.map((primate, index) => {
                        return (
                            <button key={index} className={primateActive && primateActive.fullName == primate.fullName ? styles.active : ""} onClick={() => { setPrimate(primate); setPrimateActive(primate) }}>
                                <img src={`/tinyImg/${primate.skullImgURL}.png`} />
                            </button>
                        )
                    })};
                </div>
            }
        </div>
    )
}

function Skull3DDislpay({ primate, onClickGoToSkullDisplay }) {
    if (!primate) {
        return (
            <></>
        );
    }

    return (
        <div>
            <div className="relative">
                <button onClick={() => onClickGoToSkullDisplay()} className={styles.goToSkullDisplayButton}>
                    &#8592;
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M480 491.4C538.5 447.4 576 379.8 576 304C576 171.5 461.4 64 320 64C178.6 64 64 171.5 64 304C64 379.8 101.5 447.4 160 491.4L160 528C160 554.5 181.5 576 208 576L240 576L240 536C240 522.7 250.7 512 264 512C277.3 512 288 522.7 288 536L288 576L352 576L352 536C352 522.7 362.7 512 376 512C389.3 512 400 522.7 400 536L400 576L432 576C458.5 576 480 554.5 480 528L480 491.4zM160 320C160 284.7 188.7 256 224 256C259.3 256 288 284.7 288 320C288 355.3 259.3 384 224 384C188.7 384 160 355.3 160 320zM416 256C451.3 256 480 284.7 480 320C480 355.3 451.3 384 416 384C380.7 384 352 355.3 352 320C352 284.7 380.7 256 416 256z" /></svg>
                    Retour à la liste des crânes
                </button>
                <div className="center" style={{ maxWidth: "1920px", display: "flex", justifyContent: "end" }}>
                    <PanelSubtitle reverse>Critères d'identification</PanelSubtitle>
                </div>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
                <div className={styles.sketchfabContainer}>
                    <iframe src={`${primate.skullScanURL}?ui_controls=0&ui_infos=0&ui_stop=0&ui_watermark=0 &ui_inspector=0&ui_help=0&ui_settings=0&ui_fullscreen=0`} frameborder="0"></iframe>
                </div>
                <CriteriaForm primate={primate} key={primate.fullName}></CriteriaForm>
            </div>

        </div>
    )
}

function CriteriaForm({ primate }) {
    /**
     * @param {HTMLInputElement} select 
     */
    const onChangeSelect = (select) => {
        const correctIcon = select.closest("tr").querySelector("#correct");
        const incorrectIcon = select.closest("tr").querySelector("#incorrect");
        const label = select.closest("tr").querySelector("#label");

        const answerSelected = select.value;
        if (answerSelected.trim() == "") {
            select.classList.remove(styles.incorrect);
            select.classList.remove(styles.correct);

            incorrectIcon.classList.add(styles.hidden);
            correctIcon.classList.add(styles.hidden);

            label.style.transform = "";
            return;
        }

        const correctAnswer = primate.criteria.find((c) => c.name == select.getAttribute("data-criterion-name")).description;

        label.style.transform = "translateX(30px)";
        if (answerSelected == correctAnswer) {
            select.classList.remove(styles.incorrect);
            select.classList.add(styles.correct);

            incorrectIcon.classList.add(styles.hidden);
            correctIcon.classList.remove(styles.hidden);
        } else {
            select.classList.add(styles.incorrect);
            select.classList.remove(styles.correct);

            incorrectIcon.classList.remove(styles.hidden);
            correctIcon.classList.add(styles.hidden);

        }

    }
    return (
        <div className={`${styles.criteriaTableContainer}`}>
            <table className={styles.table}>
                <tbody>
                    {CRITERIA_WITH_ANSWERS.map((criterion, index) => {
                        if (index >= 9) return;
                        const rowClass = index % 2 === 0 ? styles.rowLight : styles.rowDark;
                        return (
                            <tr key={index} className={rowClass}>
                                <td className={styles.cell}>
                                    <span id="correct" className={styles.correctIcon + " " + styles.icon + " " + styles.hidden}>&#x2714;</span>
                                    <span id="incorrect" className={styles.incorrectIcon + " " + styles.icon + " " + styles.hidden}>&#x2716;</span>
                                    <span id="label">{index + 1}. {criterion.name} :</span>
                                </td>
                                <td className={styles.cell}>
                                    <select autoComplete="off" data-criterion-name={criterion.name} onChange={(e) => onChangeSelect(e.target)}>
                                        <option value="">-</option>
                                        {criterion.possibleAnswers.map((possibleAnswser, index) => {
                                            return (
                                                <option value={possibleAnswser} key={index}>{possibleAnswser}</option>
                                            )
                                        })}
                                    </select>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    )
}