import { useState } from 'react'
import { Box } from '@chakra-ui/react'
import HomePage from './pages/HomePage'
import CreatePage from './pages/CreatePage'

function App() {

  return (
    <Box minH={"100vh"}>
      <Navbar/> 
      <Routes>
        <Route path="/"  element={<HomePage/>} />
        <Route path="/create"  element={<CreatePage/>} />

      </Routes>
     
    </Box>
  )
}

export default App
