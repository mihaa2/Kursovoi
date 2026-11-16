
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'

await mkdir('public', { recursive: true })

function icon(size, maskable = false) {
  const card = maskable
    ? '<rect x="25" y="23" width="50" height="54" rx="12" fill="white"/>'
    : '<rect x="18" y="16" width="64" height="68" rx="15" fill="white"/>'

  return Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg"
         width="${size}" height="${size}"
         viewBox="0 0 100 100">
      <rect width="100" height="100" fill="#635bff"/>
      ${card}
      <path d="M32 49 L44 61 L68 37"
            fill="none"
            stroke="#635bff"
            stroke-width="8"
            stroke-linecap="round"
            stroke-linejoin="round"/>
    </svg>
  `)
}

await sharp(icon(192))
  .png()
  .toFile('public/pwa-192x192.png')

await sharp(icon(512))
  .png()
  .toFile('public/pwa-512x512.png')

await sharp(icon(512, true))
  .png()
  .toFile('public/pwa-maskable-512x512.png')

console.log('PWA icons generated successfully!')
