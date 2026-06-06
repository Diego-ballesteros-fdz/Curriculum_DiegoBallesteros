import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GastroNómada — En construcción",
};

export default function EnConstruccion() {
  return (
    <article>
      <h1>Work in progress!!!</h1>
      <img src="/imagenes/giphy.gif" width={500} alt="En construcción" />
    </article>
  );
}
