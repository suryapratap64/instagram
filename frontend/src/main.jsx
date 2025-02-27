import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Toaster } from './components/ui/sonner.jsx'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'; 

import store from './redux/store.js'

let persistor = persistStore(store)

createRoot(document.getElementById('root')).render(
  <StrictMode>
   
      <PersistGate loading={null} persistor={persistor}>
      <Provider store={store}>
      <App />
      <Toaster/>
      </Provider>
      </PersistGate>
 
    
   
  </StrictMode>,
)
