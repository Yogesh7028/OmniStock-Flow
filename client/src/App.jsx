import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <Toaster position="top-right" toastOptions={{ duration: 3200 }} />
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;
