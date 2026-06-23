import capota from "../mock/capota.jpg"
import autofalante from "../mock/autofalante.webp"
import cabo from "../mock/cabo.jpg"
import moduloVidro from "../mock/modulo vidro.jpg"

const images = [capota, autofalante, cabo, moduloVidro]

export function getRandomMockImage() {
  return images[Math.floor(Math.random() * images.length)]
}
