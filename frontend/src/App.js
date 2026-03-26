import "@/App.css";
import AppRouter from "./AppRouter";
import { Analytics } from "@vercel/analytics/react";

function App() {
  return (
    <>
      <AppRouter />
      <Analytics />
    </>
  );
}

export default App;
