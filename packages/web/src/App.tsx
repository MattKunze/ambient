import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import "./index.css";
import { useSystemTheme } from "./useSystemTheme";

export function App() {
  const { theme, toggleTheme } = useSystemTheme();

  return (
    <>
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <a href="/" className="btn btn-ghost text-xl">
            Ambient
          </a>
        </div>
        <div className="flex-none">
          <label className="swap swap-rotate">
            <input
              type="checkbox"
              checked={theme === "synthwave"}
              onChange={toggleTheme}
            />
            <SunIcon className="swap-off h-6 w-6" />
            <MoonIcon className="swap-on h-6 w-6" />
          </label>
        </div>
      </div>

      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold">Welcome to Ambient</h1>
        <p className="mt-4">Your content goes here.</p>
      </div>
    </>
  );
}

export default App;
