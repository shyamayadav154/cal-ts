import { useState } from "react";
import "./App.css";
import Calender from "./components/Calender";

function App() {
  const [value, setValue] = useState(new Date("2022-04-05"));
  function onChange(data:Date){
    console.log({onChange:data})
    setValue(data)
  }
  return (
    <div className="App">
      <h1 className="text-2xl">Calendar</h1>
      <Calender value={value} onChange={onChange} />
    </div>
  );
}

export default App;