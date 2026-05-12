 /*
    cosas externas
    Apis
    peticiones
    uploads
 */

export const subirImagen = async (archivo) => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  console.log("Datos enviados:", { cloudName, preset, archivo }); // <-- RASTREADOR 1

  const formData = new FormData();
  formData.append("file", archivo);
  formData.append("upload_preset", preset);

  const respuesta = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!respuesta.ok) {
   console.error("Error detallado de Cloudinary:", data); // <-- RASTREADOR 2
   throw new Error("Error al subir a Cloudinary");
};

  const data = await respuesta.json();
  return data.secure_url; 
  // Este es el link mágico que se pasa a supabase como text para leer mas rapido las imagenes
};    