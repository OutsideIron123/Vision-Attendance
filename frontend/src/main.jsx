import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Search from './search.jsx'
import StaffHome from './StaffHome.jsx'
import Attendance from './Attendance.jsx'
import Stuattendance from './Stuattendance.jsx'
import RecogPage from './recog.jsx'
import Signup from './Signup.jsx'
import StuHome from './StuHome.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/Stuattendance",
    element: <Stuattendance />,
  },
  {
    path: "/Signup",
    element: <Signup />,
  },
  {
    path: "/StaffHome",
    element: <StaffHome />,
  },
  {
    path: "/recog",
    element: <RecogPage />,
  },
  {
    path: "/Attendance",
    element: <Attendance />,
  },
  {
    path: "/StuHome",
    element: <StuHome />,
  },
  {
    path: "/search",
    element: <Search />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
