// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppProvider } from './context/AppContext.tsx'
import './index.css'
import App from './App.tsx'
import { MessageProvider } from './context/MessageContext.tsx'
import { VideoCallProvider } from './context/VideoCallContext.tsx'

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <AppProvider>
      <MessageProvider>
        <VideoCallProvider>
          <App />
        </VideoCallProvider>
      </MessageProvider>
    </AppProvider>
  // </StrictMode>,
)
