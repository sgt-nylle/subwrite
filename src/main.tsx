import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

const revealPage = () => {
  requestAnimationFrame(() => {
    document.body.classList.add('loaded')
  })
}

if (document.fonts && document.fonts.ready) {
  Promise.race([
    document.fonts.ready,
    new Promise((resolve) => setTimeout(resolve, 150)),
  ]).then(revealPage)
} else {
  revealPage()
}

