'use client';

import { useState } from 'react';

interface Props {
  triggerSrc: string;
  triggerAlt: string;
  triggerTitle: string;
  triggerWidth?: number;
  nombre: string;
  descripcion: React.ReactNode;
  ingredientes: React.ReactNode;
  pasos: React.ReactNode;
  imagenSrc: string;
}

export default function RecipeOverlay({
  triggerSrc, triggerAlt, triggerTitle, triggerWidth = 400,
  nombre, descripcion, ingredientes, pasos, imagenSrc,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <img
        className="imagen"
        src={triggerSrc}
        alt={triggerAlt}
        title={triggerTitle}
        width={triggerWidth}
        onClick={() => setOpen(true)}
      />
      <div className={`Des_Recetas${open ? ' active' : ''}`}>
        <button className="cerrar" onClick={() => setOpen(false)}>X</button>
        <div className="receta_cabecera">
          <h3>{nombre}</h3>
          <br />
          {descripcion}
        </div>
        <div className="receta_ingredientes">
          <h3>Ingredientes:</h3>
          {ingredientes}
        </div>
        <img id="img_receta" src={imagenSrc} alt={nombre} />
        <div className="receta_contenido">
          <h3>Receta</h3>
          <br />
          {pasos}
        </div>
      </div>
    </>
  );
}
