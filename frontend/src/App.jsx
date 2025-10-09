import AppRouter from "./routes/appRouter";
import { AuthProvider } from "./context/authContext";

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
