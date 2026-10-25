// Despachos PATRIA · conexión con Supabase
// Copia estos dos valores de: Supabase → Project Settings → API
// (La llave "anon" es pública por diseño: la seguridad la ponen las reglas RLS de la base de datos.)
window.PATRIA_CONFIG = {
  SUPABASE_URL: "https://TU-PROYECTO.supabase.co",
  SUPABASE_ANON_KEY: "PEGA-AQUI-LA-LLAVE-ANON",
  // true cuando hayas configurado la función leer-pedido con tu llave de Anthropic
  LECTURA_IA: false
};
