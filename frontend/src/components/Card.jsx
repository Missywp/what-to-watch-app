import { Star, Tv, Film } from "lucide-react";
import styles from "./Card.module.css";

export default function Card({ item }) {
  return (
    <div className={styles.card}>
      <div className={styles.posterWrapper}>
        <img
          src={item.posterUrl}
          alt={item.titulo}
          className={styles.poster}
          loading="lazy"
        />

        <div className={styles.badgeType}>
          {item.tipo === "filme" ? (
            <Film size={12} color="#6366f1" />
          ) : (
            <Tv size={12} color="#6366f1" />
          )}
          {item.tipo}
        </div>

        <div className={styles.badgeRating}>
          <Star size={12} fill="#0b0f19" />
          {item.nota}
        </div>
      </div>

      <div className={styles.content}>
        <div>
          <div className={styles.headerInfo}>
            <h3 className={styles.title}>{item.titulo}</h3>
            <span className={styles.year}>{item.ano}</span>
          </div>
          <p className={styles.synopsis}>{item.sinopse}</p>
        </div>

        <div>
          <div className={styles.tags}>
            {item.generos.map((gen) => (
              <span key={gen} className={styles.tag}>
                {gen}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
