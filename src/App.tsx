import { format, sub } from "date-fns";
import { startOfToday } from "date-fns/esm";
import { useState } from "react";
import "./App.css";
import Calender from "./components/Calender";


// defualt date of 01 januagry 1970

const today = startOfToday()
const DEFAULTDATE = sub(today, { years: 25 })

function App() {
  const [value, setValue] = useState(DEFAULTDATE);
  const [isCalenderOpen, setIsCalenderOpen] = useState(false);
  function onChange(data: Date) {
    console.log({ onChange: data });
    setValue(data);
  }

  return (
    <div className="App">
      <h1 className="text-2xl">Calendar</h1>
      <input
        type="text"
        className="block w-[300px] mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        value={format(value, "dd MMMM yyyy")}
        onFocus={() => setIsCalenderOpen(true)}
      />
      {isCalenderOpen && (
        <Calender
          value={value}
          onChange={onChange}
          closeCalendar={() => setIsCalenderOpen(false)}  
        />
      )}
    </div>
  );
}

export default App;
