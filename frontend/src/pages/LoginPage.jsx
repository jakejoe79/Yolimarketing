import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple password check - in production use proper auth
    const adminPassword = localStorage.getItem("art-admin-password") || "admin123";
    
    if (password === adminPassword) {
      localStorage.setItem("art-auth", "true");
      navigate("/dashboard");
    } else {
      setError("Contraseña incorrecta");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm border border-[#E7E5DF]">
        <h1 
          className="text-3xl mb-6 text-center text-[#1C1917] font-bold"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Iniciar Sesión
        </h1>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label className="text-[#57534E] uppercase tracking-wider text-xs font-semibold">
              Contraseña de Administrador
            </Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-2 border-[#E7E5DF] bg-white"
              data-testid="login-password"
            />
          </div>
          
          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}
          
          <Button
            type="submit"
            className="w-full bg-[#C8553D] hover:bg-[#A64530] text-white py-3"
            data-testid="login-submit"
          >
            Entrar
          </Button>
        </form>
        
        <p className="text-center text-sm text-[#57534E] mt-4">
          Contraseña por defecto: admin123
        </p>
      </div>
    </div>
  );
}
