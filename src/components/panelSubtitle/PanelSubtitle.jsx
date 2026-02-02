import styles from './PanelSubtitle.module.css';

export default function PanelSubtitle({ children, className = "", reverse = false }) {
    if (reverse) {
        return (
            <div className={styles.container} style={{justifyContent: "end"}}>
                <h3 className={`${styles.panelSubtitle} ${className}`}>
                    {/* {!reverse && <span>&#10149;</span>} */}
                    {children}
                    {/* {reverse && <span style={{transform: "scale(-1, -1)", display: "inline-block"}}>&#10149;</span>} */}
                </h3>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h3 className={`${styles.panelSubtitle} ${className}`}>
                {/* {!reverse && <span>&#10149;</span>} */}
                {children}
                {/* {reverse && <span style={{transform: "scale(-1, -1)", display: "inline-block"}}>&#10149;</span>} */}
            </h3>
        </div>
    );
}