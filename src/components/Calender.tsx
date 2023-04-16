import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import {
  add,
  eachDayOfInterval,
  eachYearOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isSameMonth,
  parse,
  setYear,
} from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import ResizablePanel from "./ResizablePanel";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function Calender({
  value,
  onChange,
  closeCalendar,
}: {
  value: Date;
  onChange: (day: Date) => void;
  closeCalendar: () => void;
}) {
  let today = value;
  console.log({ today, value });

  const [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  const [showCalendarYears, setShowCalendarYears] = useState(false);
  const [selectedYear, setSelectedYear] = useState(format(today, "yyyy"));
  const [isShowBackAnimation, setIsShowBackAnimation] = useState(false);
  let firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());
  function previousMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });

    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
    setIsShowBackAnimation(true);
    // setAnimationKey(crypto.randomUUID())
  }

  function nextMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });

    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
    setIsShowBackAnimation(false);
    // setAnimationKey(crypto.randomUUID())
  }

  function changeDate(years: string) {
    let newDate = setYear(firstDayCurrentMonth, parseInt(years));

    setCurrentMonth(format(newDate, "MMM-yyyy"));
  }

  function toggleShowCalender() {
    setShowCalendarYears(!showCalendarYears);
  }

  let newDays: Date[] = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });

  useEffect(() => {
    changeDate(selectedYear);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear]);

  return (
    <div className=' mx-auto max-w-xs  text-sm  md:divide-gray-200'>
      <div className=''>
        <CalenderHead
          toggleShowCalender={toggleShowCalender}
          firstDayCurrentMonth={firstDayCurrentMonth}
          showCalendarYears={showCalendarYears}
          previousMonth={previousMonth}
          nextMonth={nextMonth}
        />
        <AnimatePresence initial={false}>
          {showCalendarYears ? (
            <CalenderYears
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              toggleShowCalender={toggleShowCalender}
            />
          ) : (
            <CalendarDates
              setSelectedDay={onChange}
              selectedDay={today}
              firstDayCurrentMonth={firstDayCurrentMonth}
              newDays={newDays}
              isShowBackAnimation={isShowBackAnimation}
              closeCalendar={closeCalendar}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
const toggleVariant = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
};

let colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
];

type CalenderDatesProps = {
  setSelectedDay: (day: Date) => void;
  selectedDay: Date;
  firstDayCurrentMonth: Date;
  newDays: Date[];
  isShowBackAnimation: boolean;
  closeCalendar: () => void;
};
type CalenderYearsProps = {
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  toggleShowCalender: () => void;
};

function CalenderYears({ selectedYear, setSelectedYear, toggleShowCalender }: CalenderYearsProps) {
  const years = eachYearOfInterval({
    start: new Date(1990, 0, 1),
    end: new Date(2025, 0, 1),
  });
  console.log({ years });
  return (
    <motion.section variants={toggleVariant} initial='hidden' animate='visible'>
      <div className='grid mt-5 gap-3 p-1 border rounded-md scrollbar-thin grid-cols-4 h-[250px] overflow-y-auto'>
        {years.map((date) => (
          <button
            onClick={() => {
              setSelectedYear(format(date, "yyyy"));
              toggleShowCalender();
            }}
            className={clsx(
              {
                "bg-blue-600 hover:bg-blue-600 text-white":
                  selectedYear === date.getFullYear().toString(),
              },
              "rounded py-1 hover:bg-gray-50"
            )}
            key={date.toString()}
          >
            {date.getFullYear()}
          </button>
        ))}
      </div>
    </motion.section>
  );
}

function CalendarDates(props: CalenderDatesProps) {
  const {
    setSelectedDay,
    selectedDay,
    firstDayCurrentMonth,
    newDays,
    isShowBackAnimation,
    closeCalendar,
  } = props;

  return (
    <motion.section
      className='border rounded-md mt-5'
      variants={toggleVariant}
      initial='hidden'
      animate='visible'
    >
      <div className='mt-5 grid grid-cols-7 text-center text-xs leading-6 text-gray-500'>
        <div>S</div>
        <div>M</div>
        <div>T</div>
        <div>W</div>
        <div>T</div>
        <div>F</div>
        <div>S</div>
      </div>
      <ResizablePanel
        isShowBackAnimation={isShowBackAnimation}
        animeKey={newDays[0].toISOString()}
      >
        <div className='  grid grid-cols-7 text-sm'>
          {newDays.map((day, dayIdx) => (
            <div
              key={day.toString()}
              className={classNames(
                dayIdx > 6 && " border-gray-200",
                dayIdx === 0 && colStartClasses[getDay(day)],
                "py-1"
              )}
            >
              <button
                type='button'
                onClick={() => {
                  setSelectedDay(day);
                  closeCalendar();
                }}
                className={clsx("mx-auto flex h-8 w-8 items-center justify-center rounded-xl", {
                  "text-white": isEqual(day, selectedDay),
                  "text-gray-900":
                    !isEqual(day, selectedDay) && isSameMonth(day, firstDayCurrentMonth),
                  "text-gray-400":
                    !isEqual(day, selectedDay) && !isSameMonth(day, firstDayCurrentMonth),
                  "bg-blue-600": isEqual(day, selectedDay),
                  "hover:bg-gray-200": !isEqual(day, selectedDay),
                  "font-semibold": isEqual(day, selectedDay),
                })}
              >
                <time dateTime={format(day, "yyyy-MM-dd")}>{format(day, "d")}</time>
              </button>
            </div>
          ))}
        </div>
      </ResizablePanel>
    </motion.section>
  );
}

type CalenderHeadProps = {
  toggleShowCalender: () => void;
  firstDayCurrentMonth: Date;
  showCalendarYears: boolean;
  previousMonth: () => void;
  nextMonth: () => void;
};

function CalenderHead({
  toggleShowCalender,
  firstDayCurrentMonth,
  showCalendarYears,
  previousMonth,
  nextMonth,
}: CalenderHeadProps) {
  return (
    <div className='flex items-center py-1.5 mt-5 justify-between'>
      <button
        onClick={previousMonth}
        type='button'
        className=' flex flex-none items-center justify-center text-gray-400 hover:text-gray-500'
      >
        <span className='sr-only'>Previous month</span>
        <ChevronLeftIcon className='h-5 w-5' aria-hidden='true' />
      </button>
      <button
        onClick={toggleShowCalender}
        className=' flex gap-1   hover:bg-gray-50 px-3 py-1 rounded items-center text-sm font-semibold text-gray-600'
      >
        <span>{format(firstDayCurrentMonth, "MMMM yyyy")}</span>
        <span>
          <ChevronDownIcon
            className={clsx("h-5 w-5 transition-transform duration-300", {
              "rotate-180": showCalendarYears,
            })}
            aria-hidden='true'
          />
        </span>
      </button>
      <button
        onClick={nextMonth}
        type='button'
        className=' flex flex-none items-center justify-center  text-gray-400 hover:text-gray-500'
      >
        <span className='sr-only'>Next month</span>
        <ChevronRightIcon className='h-5 w-5' aria-hidden='true' />
      </button>
    </div>
  );
}
