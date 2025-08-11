import styles from './PanelSubtitle.module.css';

export default function PanelSubtitle({ children, className = "" }) {
    return (
        <div className={styles.container}>
            <h3 className={`${styles.panelSubtitle} ${className}`}>
                &#10149;
                {children}
            </h3>
        </div>
    );
}