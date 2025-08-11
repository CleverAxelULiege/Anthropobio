import Nav from "../components/nav/Nav";
import Subtitle from "../components/subtitle/Subtitle";
import Title from "../components/title/Title";
import styles from "./Learning.module.css";
import { BASE_VIDEOS, CRITERION_VIDEOS, PRIMATES, VIDEOS } from "../App";
import { useAppSettings } from "../AppSettingsContext";
import { useEffect, useState } from "react";
import PanelSubtitle from "../components/panelSubtitle/PanelSubtitle";

/**
 * 
 * @param {{setTabs:React.Dispatch<React.SetStateAction<string>>}} props 
 * @returns 
 */
export default function Learning(props) {


    return (
        <>
            <div className="center">
                <Nav></Nav>
                <Title>Identification de crânes de singes <br></br> et d'hommes fossiles</Title>

                <Subtitle>
                    Visionnez les vidéos ci-dessous et découvrez à quoi être attentif lorsque vous observez un crâne <br></br>(« Bases ») ainsi que les 9 critères morphologiques qui permettent de l’identifier (« Critères »)
                </Subtitle>
            </div>

            <VideosSection onClickGotoCriteriaTable={() => { }}></VideosSection>

            {/* <CriteriaTableSection onClickGotoVideos={() => {}}></CriteriaTableSection> */}


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
            </div>
        </>
    );
}

function CriteriaTableSection() {
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
            <div>
                <div className="center">
                    <PanelSubtitle>Critères morphologiques</PanelSubtitle>
                </div>
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

