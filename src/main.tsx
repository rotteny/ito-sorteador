import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/quicksand/latin-500.css'
import '@fontsource/quicksand/latin-600.css'
import '@fontsource/quicksand/latin-700.css'
import '@fontsource/quicksand/latin-ext-500.css'
import '@fontsource/quicksand/latin-ext-600.css'
import '@fontsource/quicksand/latin-ext-700.css'
import '@fontsource/dm-mono/latin-400.css'
import '@fontsource/dm-mono/latin-500.css'
import './styles/tokens.css'
import './styles/global.css'
import { App } from './App'

const root = document.getElementById('root')
if (!root) throw new Error('#root não encontrado')

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
