/**
 * Script de GoatCounter (estadísticas sin cookies). `code` es el nombre de la cuenta:
 * https://<code>.goatcounter.com. Sin código válido no se carga nada.
 */
export function goatcounterScript(code: string) {
  const c = code.trim()
  if (!/^[a-z0-9-]+$/i.test(c)) return null
  return {
    src: 'https://gc.zgo.at/count.js',
    async: true,
    'data-goatcounter': `https://${c}.goatcounter.com/count`,
  }
}
