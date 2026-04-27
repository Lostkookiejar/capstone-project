import LoginPage from "./pages/LoginPage.jsx";
import Testpage from "./pages/Testpage.jsx";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import { AuthProvider } from "./components/AuthProvider.jsx";
import { Provider } from "react-redux";
import { store } from "../store.js";

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/testing" element={<Testpage />} />
            <Route path="*" element={<LoginPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  );
}

export default App;
