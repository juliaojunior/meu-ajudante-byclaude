import sharp from 'sharp';
import { copyFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// Copia o ícone completo gerado pelo Next.js para resources/icon.png
console.log('Copiando out/icon → resources/icon.png...');
copyFileSync(join(root, 'out', 'icon'), join(root, 'resources', 'icon.png'));

// Gera o fundo sólido laranja (1024x1024)
console.log('Gerando resources/icon-background.png...');
await sharp({
  create: {
    width: 1024,
    height: 1024,
    channels: 4,
    background: { r: 194, g: 65, b: 12, alpha: 1 },
  },
})
  .png()
  .toFile(join(root, 'resources', 'icon-background.png'));

// Gera o foreground com pílula + "MA" em fundo transparente (1024x1024)
// Design baseado no app/icon.tsx escalado para 1024x1024
const foregroundSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024">
  <defs>
    <clipPath id="pillClip">
      <rect x="292" y="316" width="440" height="200" rx="100" ry="100"/>
    </clipPath>
  </defs>

  <!-- Pílula: fundo semi-transparente + borda branca -->
  <rect x="292" y="316" width="440" height="200" rx="100" ry="100"
        fill="rgba(255,255,255,0.15)"
        stroke="rgba(255,255,255,0.6)"
        stroke-width="12"/>

  <!-- Metade esquerda da pílula: branco opaco -->
  <g clip-path="url(#pillClip)">
    <rect x="0" y="0" width="512" height="1024" fill="rgba(255,255,255,0.9)"/>
  </g>

  <!-- Texto "MA" -->
  <text x="512" y="672"
        font-family="sans-serif"
        font-size="144"
        font-weight="700"
        fill="white"
        text-anchor="middle"
        letter-spacing="-4">MA</text>
</svg>`;

console.log('Gerando resources/icon-foreground.png...');
await sharp(Buffer.from(foregroundSvg))
  .png()
  .toFile(join(root, 'resources', 'icon-foreground.png'));

console.log('Pronto! Execute agora: npx @capacitor/assets generate --android');
