import styles from "./Title.module.css";

/**
 * @param {Object} props
 * @param {string | JSX.Element} props.children
 * @param {string} [props.className]
 */
export default function Title({ children, className }) {
    return (
        <h1 className={`${styles.title} ${className}`}>
            {children}
        </h1>
    );
}
