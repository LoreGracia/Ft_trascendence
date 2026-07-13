"use client";

import { useSession } from "next-auth/react";

export default function SessionDebug() {
  const { data: session, status } = useSession();

  return (
    <>
      <p>Status: {status}</p>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </>
  );
}

//            Componente de debug
// Al situarlo en una pagina agrega una seccion que 
// muestra el estado de la sesion