import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation';
import * as sessionActions from './store/session';
import LandingPage from './components/LandingPage/LandingPage';
import SpotDetails from './components/SpotDetails/SpotDetails';
import NewSpot from './components/NewSpot/NewSpot';
import ManageKitchens from './components/ManageKitchens/ManageKitches';
import UpdateSpot from './components/UpdateSpot/UpdateSpot';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <LandingPage/>
      },
      {
        path: '/spots/:id',
        element: <SpotDetails/>
      },
      {
        path: '/spots/new',
        element: <NewSpot/>
      },
      {
        path: '/spots/current',
        element: <ManageKitchens/>
      },
      {
        path: '/spots/:spotId/edit',
        element: <UpdateSpot/>
      }
    ]
  }
]);
//
function App() {
  return <RouterProvider router={router} />;
}

export default App;
