import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    localStorage.setItem("token", "user-authenticated"); // Simpan token simulasi
    navigate("/dashboard", { replace: true }); // Ganti history agar tidak bisa back ke login
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Login Page</h1>
      <button
        onClick={handleLogin}
        className="px-4 py-2 bg-green-500 text-white rounded-md"
      >
        Login & Go to Dashboard
      </button>
    </div>
  );
};

export default Login;