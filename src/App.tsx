import { Outlet, Route, Routes } from 'react-router'
import About from './components/Clientinterface/about';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* ...existing routes */}
        <Route path="/about" element={<About />} />
        {/* ...other routes */}
      </Routes>
      <Outlet />
    </div>
  )
}

export default App
