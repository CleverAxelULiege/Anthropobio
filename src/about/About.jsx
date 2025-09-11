import styles from "./About.module.css";

export default function About() {
    return (
        <div className={styles.about}>
            <h2>Mot introductif relatif au site Internet</h2>
            <p>Le présent site Internet a été construit sur la base des Travaux Dirigés virtuels du cours d’Anthropologie biologique initialement mis au point en 1999 par le Service d’Éthologie et de Psychologie Animale de l’Université de Liège, et en particulier par les Drs Jean-Luc GILLES, Pascal PONCIN, Jean-Claude RUWET et Dieudonné LECLERCQ (cf. Gilles et al., 1999) <span>[ i ]</span>.</p>

            <p>Les ajouts pédagogiques (vidéos présentant les critères d’identification des crânes, emploi de modèles virtuels 3D,…) sont le fruit du travail des Drs Alice LEDENT, Fany BROTCORNE, Johann DELCOURT et Pascal PONCIN. </p>

            <p>La conception et la réorganisation du site Internet ont été réalisées par Jacques SOUGNÉ et Axel CLEVER de l’UDI FPLSE. Les numérisations 3D des moulages des crânes de la collection ont été réalisées par le Pr Valentin FISHER. Enfin, les vidéos ont été tournées dans le studio RapidMooc de l’IFRES. </p>
        
            <hr />

            <p><span>[ i ]</span> Gilles, J.-L., Poncin, P., Ruwet, J.-C., & Leclercq, D. (1999). Les travaux dirigés virtuels d’Anthropologie biologique : bilan d’une première utilisation. 12e Colloque de l’Association Internationale de Pédagogie Universitaire (AIPU). Enseigner Autrement, 1, 294–307. https://hdl.handle.net/2268/5910 </p>

            <div className={styles.logoContainer}>
                <img src="/images/thumbnail_PMC_ULg.png" alt="" />
            </div>
        </div>
    )
}