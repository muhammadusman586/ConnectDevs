
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Body from './Body'
import Login from './components/Login'
import { Provider } from 'react-redux'
import { appStore } from './utils/appStore'
import Feed from './components/Feed'
import Profile from './components/Profile'
import Connections from './components/Connections'
import Requests from './components/Requests'




function App() {
  

  return (
   <>
   <Provider store={appStore}>
   <BrowserRouter basename='/'>
    <Routes>
     
     <Route path='/' element={<Body/>}>
     <Route path='/' element={<Feed/>} />
     <Route path='/login' element={<Login/>}/>
     <Route path='/profile' element={<Profile/>}/>
     <Route path='/connections' element={<Connections/>} />
     <Route path='/requests' element={<Requests/>}/>
    
     {/* <Route path='/requests' /> */}


     </Route>

    </Routes>
    
    </BrowserRouter>

   </Provider>
    
    
   </>
  )
}

export default App