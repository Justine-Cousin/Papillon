import "./App.css";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./services/authContext";

function App() {
  return (
    <AuthProvider>
      <div>
        <main>
          <Outlet />
        </main>
        <Navbar />
      </div>
    </AuthProvider>
  );
}

export default App;
