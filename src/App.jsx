import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Product from './pages/Product.jsx';
import HomePage from './pages/Homepage.jsx';
import Pricing from './pages/Pricing';
import ErrorPage from './pages/ErrorPage.jsx';
import AppLayout from './pages/AppLayout.jsx';
import Login from './pages/Login.jsx';
import CityList from './components/CityList.jsx';
import CountriesList from './components/CountryList.jsx';
import City from './components/City.jsx';
import Form from './components/Form.jsx';
import { CitiesProvider } from './context/CitiesContext.jsx';
import { AuthProvider } from './context/FakeAuthContext.jsx';
function App() {
  return (
    <AuthProvider>
      <CitiesProvider>
        <BrowserRouter>
          <Routes>
            <Route index element={<HomePage />} />
            <Route path='product' element={<Product />} />
            <Route path='pricing' element={<Pricing />} />
            <Route path='login' element={<Login />} />
            <Route path='app' element={<AppLayout />}>
              <Route index element={<Navigate replace to='cities' />} />
              <Route path='cities' element={<CityList />} />
              <Route path='cities/:id' element={<City />} />
              <Route path='countries' element={<CountriesList />} />
              <Route path='form' element={<Form />} />
            </Route>

            <Route path='*' element={<ErrorPage />} />
          </Routes>
        </BrowserRouter>
      </CitiesProvider>
    </AuthProvider>
  );
}

export default App;
