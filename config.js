/* === Conexión a Supabase (Oregón · us-west-2) — AMBIENTE DE PRUEBAS ===
   /test/ ahora sirve la página de obra-feable (São Paulo) PERO apuntando a la
   base de PRUEBAS obra-test-oregon, para NO tocar la base real de producción.
   Prefijo local tst4_ (aislado de la oficial sgto4_). */
window.SUPA_CFG = {
  url: "https://lotfscfgkgsnqwwnftoo.supabase.co",
  key: "sb_publishable_1PFZ1zZjhhEthjkFFdI7rQ_uuPB0kaF"
};
