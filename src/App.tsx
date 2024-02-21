import "./App.css";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";

function App() {
  return (
    <div>
      <Navbar />
      <h1 className="text-3xl font-bold underline">Welcome to Dromos!</h1>
      <Button>Click me</Button>
    </div>
  );
}

export default App;
