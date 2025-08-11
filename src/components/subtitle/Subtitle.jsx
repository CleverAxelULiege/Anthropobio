import styles from "./Subtitle.module.css";

/**
 * 
 * @param {Object} props
 * @param {string | JSX.Element} props.children
 * @param {string} [props.className]
 */
export default function Subtitle({ children, className }) {
  return (
    <p className={`${styles.subtitle} ${className}`}>
      {children}
    </p>
  );
}
