import { TABS } from "../App";
import styles from "./Home.module.css";

/**
 * 
 * @param {{setTabs:React.Dispatch<React.SetStateAction<string>>}} props 
 * @returns 
 */
export default function Home(props) {
    return (
        <>
            <div>
                <div>
                    <h1 className={styles.title}>
                        Mettez-vous dans la peau des étudiantes et étudiants du cours
                        d’anthropologie biologique de l’Université de Liège.
                        <br />
                        <br />
                        Apprenez à identifier les crânes d’hommes et de singes fossiles
                    </h1>
                </div>
            </div>

            <svg width="100%" height="100" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path
                    d="M0 5 Q 12.5 0, 25 5 T 50 5 T 75 5 T 100 5"
                    fill="transparent"
                    stroke="white"
                    strokeWidth="1.5"
                />
            </svg>
            <div>
                <section>
                    <div className={styles.sectionContainer}>
                        <div>
                            <h2 className={styles.sectionTitle}>
                                Commencez par découvrir les différents critères permettant
                                d’identifier ces crânes, au travers de vidéos
                            </h2>
                            <a href={`?tab=${TABS.learning}`} onClick={(e) => {
                                e.preventDefault();
                                props.setTabs(TABS.learning);
                            }} className={styles.buttonLink}>
                                Découverte
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                    <path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z" />
                                </svg>
                            </a>
                        </div>
                        <div className={styles.imgContainer}>
                            <img src="images/screenshot_video1.png" alt="" />
                            <div className={styles.filmIcon}>
                                <img src="images/film_white.png" alt="" />
                            </div>
                        </div>
                    </div>
                </section>

                <hr className={styles.separatorSection} />

                <section className={styles.skullHandling}>
                    <div className={styles.sectionContainer}>
                        <div>
                            <h2 className={styles.sectionTitle}>
                                Manipulez ensuite ces crânes en 3D pour tenter de les identifier
                            </h2>
                            <a href={`?tab=${TABS.observation}`} onClick={(e) => {
                                e.preventDefault();
                                props.setTabs(TABS.observation);
                            }} className={styles.buttonLink}>
                                Manipulation
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                    <path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z" />
                                </svg>
                            </a>
                        </div>
                        <div className={`${styles.imgContainer} ${styles.skullHandlingImg}`}>
                            <img src="images/screenshot_skull_3d.png" alt="" />
                            <div className={styles.iconGrabCursor}>
                                <img src="images/grab_hand.png" alt="" />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}
