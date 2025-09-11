import Subtitle from "../components/subtitle/Subtitle";
import Title from "../components/title/Title";
import styles from "./Learning.module.css";
import { BASE_VIDEOS, CRITERION_VIDEOS, PRIMATES, VIDEOS } from "../App";
import { useAppSettings } from "../AppSettingsContext";
import { useEffect, useRef, useState } from "react";
import PanelSubtitle from "../components/panelSubtitle/PanelSubtitle";


export default function Learning() {
    /**
     * @type {React.RefObject<HTMLDivElement>}
     */
    const carouselTrackRef = useRef(null);

    useEffect(() => {
        document.getElementById("expert_mode_button").classList.add("hidden");
    }, []);

    const onClickGoToCriteriaTable = () => {
        carouselTrackRef.current.style.transform = "translateX(-100%)";
        document.getElementById("expert_mode_button").classList.remove("hidden");

    }
    const onClickGoToVideos = () => {
        document.getElementById("expert_mode_button").classList.add("hidden");
        carouselTrackRef.current.style.transform = "";
    }

    return (
        <>
            <div className="center">


                <Subtitle>
                    Visionnez les vidéos ci-dessous et découvrez à quoi être attentif lorsque vous observez un crâne <br></br>(« Bases ») ainsi que les 9 critères morphologiques qui permettent de l’identifier (« Critères »)
                </Subtitle>
            </div>

            <div className={styles.carouselContainer}>
                <div className={styles.carouselWrapper}>
                    <div ref={carouselTrackRef} className={styles.carouselTrack}>

                        <div className={styles.carouselSlide}>
                            <VideosSection onClickGotoCriteriaTable={onClickGoToCriteriaTable}></VideosSection>
                        </div>

                        <div className={styles.carouselSlide}>
                            <CriteriaTableSection onClickGoToVideoTutorials={onClickGoToVideos}></CriteriaTableSection>
                        </div>

                    </div>
                </div>
            </div>




        </>
    )
}


function VideosSection({ onClickGotoCriteriaTable }) {
    const [selectedVideo, setSelectedVideo] = useState(VIDEOS[0]?.url || '');

    return (
        <>
            <div className="relative">
                <div className="center" style={{ maxWidth: "1920px" }}>
                    <PanelSubtitle>Critères d'identification</PanelSubtitle>
                </div>
                <button onClick={() => onClickGotoCriteriaTable()} className={styles.goToCriteriaTableButton}>
                    Critères morphologiques
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M480 491.4C538.5 447.4 576 379.8 576 304C576 171.5 461.4 64 320 64C178.6 64 64 171.5 64 304C64 379.8 101.5 447.4 160 491.4L160 528C160 554.5 181.5 576 208 576L240 576L240 536C240 522.7 250.7 512 264 512C277.3 512 288 522.7 288 536L288 576L352 576L352 536C352 522.7 362.7 512 376 512C389.3 512 400 522.7 400 536L400 576L432 576C458.5 576 480 554.5 480 528L480 491.4zM160 320C160 284.7 188.7 256 224 256C259.3 256 288 284.7 288 320C288 355.3 259.3 384 224 384C188.7 384 160 355.3 160 320zM416 256C451.3 256 480 284.7 480 320C480 355.3 451.3 384 416 384C380.7 384 352 355.3 352 320C352 284.7 380.7 256 416 256z" /></svg>
                    &#8594;
                </button>
            </div>
            <div>
                <div className={styles.videosContainer}>
                    <div className={styles.videosList}>
                        <div>
                            {BASE_VIDEOS.map((video, index) => (
                                <button
                                    key={index}
                                    className={`${styles.videoButton} ${selectedVideo === video.url ? styles.active : ''}`}
                                    onClick={() => setSelectedVideo(video.url)}
                                >
                                    {video.name}
                                </button>
                            ))}

                        </div>
                        <div>
                            {CRITERION_VIDEOS.map((video, index) => (
                                <button
                                    key={index}
                                    className={`${styles.videoButton} ${selectedVideo === video.url ? styles.active : ''}`}
                                    onClick={() => setSelectedVideo(video.url)}
                                >
                                    {video.name}
                                </button>
                            ))}

                        </div>
                    </div>

                    <div className={styles.videoPlayer}>
                        {selectedVideo ? (
                            <iframe
                                className={styles.iframe}
                                src={selectedVideo}
                                title="Video Player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        ) : (
                            <div className={styles.noVideo}>
                                <p className={styles.noVideoText}>Sélectionnez une vidéo pour commencer</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className={styles.buttonContainer}>
                    <a href="" className={styles.goToObservationButton}>
                        C'est parti pour la manipulation 
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M135.4 317.6C130.6 309.9 128 301.1 128 292L128 256C128 229.5 149.5 208 176 208L192 208L192 128C192 101.5 213.5 80 240 80C257.3 80 272.4 89.1 280.9 102.8C285.2 80.7 304.7 64 328 64C351.4 64 370.9 80.8 375.1 102.9C382.4 98.5 390.9 96 400 96C422.1 96 440.8 111 446.3 131.4C451.8 129.2 457.7 128 464 128C490.5 128 512 149.5 512 176L512 272.9C512 282.8 509.7 292.6 505.2 301.5L465.6 380.6C454.8 402.3 432.6 416 408.4 416L224 416C207.5 416 192.2 407.6 183.4 393.6L135.4 317.6zM160 544L160 496C160 478.3 174.3 464 192 464L448 464C465.7 464 480 478.3 480 496L480 544C480 561.7 465.7 576 448 576L192 576C174.3 576 160 561.7 160 544z" /></svg>
                    </a>
                </div>
                <div>hello world</div>
            </div>
        </>
    );
}

function CriteriaTableSection({ onClickGoToVideoTutorials }) {
    const { expertMode, setExpertMode, primateId, setPrimateId } = useAppSettings();
    const [primate, setPrimate] = useState(null);

    useEffect(() => {
        if (!expertMode && primate && primate.isExpert) {
            setPrimate(null);
        }
    }, [expertMode]);

    const onClickCriteriaTable = (primate) => {
        setPrimate(primate)
    }
    return (
        <section>
            <div className="relative">
                <div className="center" style={{ maxWidth: "1920px", display: "flex", justifyContent: "end" }}>
                    <PanelSubtitle reverse>Critères morphologiques</PanelSubtitle>
                </div>

                <button onClick={() => onClickGoToVideoTutorials()} className={styles.goToVideosButton}>
                    &#8592;
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M128 128C92.7 128 64 156.7 64 192L64 448C64 483.3 92.7 512 128 512L384 512C419.3 512 448 483.3 448 448L448 192C448 156.7 419.3 128 384 128L128 128zM496 400L569.5 458.8C573.7 462.2 578.9 464 584.3 464C597.4 464 608 453.4 608 440.3L608 199.7C608 186.6 597.4 176 584.3 176C578.9 176 573.7 177.8 569.5 181.2L496 240L496 400z" /></svg>
                    Retour aux vidéos
                </button>
            </div>
            <div>
                <SelectableGrid onClick={onClickCriteriaTable}></SelectableGrid>
            </div>
            {
                primate &&
                <div className={styles.criteriaWithDescription}>
                    <CriteriaTable primate={primate}></CriteriaTable>
                    <p><b><u>Remarque :</u></b> {primate.remark}</p>
                </div>
            }

        </section>
    )
}

/**
 * 
 * @param {{
 *  onClick: (fullPrimateName:string) => void
 * }} props
 * @returns 
 */
function SelectableGrid(props) {
    const { expertMode, setExpertMode, primateId, setPrimateId } = useAppSettings();
    const [primateActive, setPrimateActive] = useState(null);

    useEffect(() => {
        if (!expertMode && primateActive && primateActive.isExpert) {
            setPrimateActive(null);
        }

    }, [expertMode]);

    return (
        <div className={styles.primateNamesContainer} style={{ gridTemplateColumns: expertMode ? "repeat(8, 1fr)" : "repeat(6, 1fr)" }}>

            {expertMode &&
                PRIMATES.filter((primate) => primate.shouldHighlight).map((primate, index) => (
                    <button
                        onClick={() => { props.onClick(primate); setPrimateActive(primate) }}
                        key={index}
                        className={`${primateActive && primate.fullName == primateActive.fullName ? styles.active : ""}`}
                    >
                        {primate.name}
                    </button>
                ))}

            {!expertMode &&
                PRIMATES.filter(
                    (primate) => primate.shouldHighlight && primate.isExpert === false
                ).map((primate, index) => (
                    <button
                        onClick={() => { props.onClick(primate); setPrimateActive(primate) }}
                        key={index}
                        className={`${primateActive && primate.fullName == primateActive.fullName ? styles.active : ""}`}
                    >
                        {primate.name}
                    </button>
                ))}
        </div>
    );
}

function CriteriaTable({ primate }) {
    return (
        <div className={`${styles.criteriaTableContainer}`}>
            <table className={styles.table}>
                <tbody>
                    {primate.criteria.map((criterion, index) => {
                        if (index >= 9) return;
                        const rowClass = index % 2 === 0 ? styles.rowLight : styles.rowDark;
                        return (
                            <tr key={index} className={rowClass}>
                                <td className={styles.cell}>{criterion.name} :</td>
                                <td className={styles.cell}>{criterion.description}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    )
}

