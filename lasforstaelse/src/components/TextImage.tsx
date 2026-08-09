import React, { useState } from 'react';

interface TextImageProps {
  src: string;
  /** Textens titel, används i det alternativa texten. */
  title: string;
  className?: string;
}

/**
 * Bilden som hör till en lästext.
 *
 * Samtliga bilder ligger hos en enda extern värd. Går den inte att nå – skolans
 * nät blockerar den, tjänsten strular, eleven sitter på ett svagt mobilnät –
 * ritade webbläsaren tidigare sin trasiga bildikon i en tom ruta ovanför texten.
 * Det ser ut som att appen är sönder, och det drabbar alla elever samtidigt
 * eftersom alla bilder kommer från samma håll.
 *
 * Går bilden inte att hämta försvinner rutan helt i stället. Texten är det
 * viktiga, och bilden är stöd – inte något uppgiften hänger på.
 *
 * Höjden är reserverad medan bilden laddar, så att texten inte hoppar nedåt
 * när den kommer fram.
 */
export const TextImage: React.FC<TextImageProps> = ({ src, title, className = '' }) => {
  const [misslyckades, setMisslyckades] = useState(false);
  const [laddad, setLaddad] = useState(false);

  if (misslyckades) return null;

  return (
    <div className={`mb-4 ${className}`}>
      <div
        className="w-full rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700"
        style={{ height: laddad ? 'auto' : '11rem' }}
      >
        <img
          src={src}
          alt={`Bild till ${title}`}
          loading="lazy"
          onLoad={() => setLaddad(true)}
          onError={() => setMisslyckades(true)}
          className="w-full max-h-64 object-cover"
        />
      </div>
    </div>
  );
};

export default TextImage;
