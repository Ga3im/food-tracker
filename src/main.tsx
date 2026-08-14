import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './App.css'

// Импортируем авто-регистратор воркера из плагина PWA
import { registerSW } from 'virtual:pwa-register'

// Регистрируем Service Worker для работы офлайн. 
// Стратегия 'autoUpdate' сама обновит приложение, когда вы выкатите новый билд в сеть.
registerSW({ immediate: true })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
