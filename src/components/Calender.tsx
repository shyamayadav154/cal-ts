import { Menu, Transition } from "@headlessui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import {
  ChevronDownIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
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
import { Fragment, useEffect, useState } from "react";
import ResizablePanel from "./ResizablePanel";

const meetings = [
  {
    id: 1,
    name: "Leslie Alexander",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    start: "1:00 PM",
    startDatetime: "2022-01-21T13:00",
    end: "2:30 PM",
    endDatetime: "2022-01-21T14:30",
  },
  // More meetings...
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function Calender({
  value,
  onChange,
}: {
  value: Date;
  onChange: (day: Date) => void;
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

  function changeYear(years: string) {
    let newDate = setYear(firstDayCurrentMonth, parseInt(years));

    setCurrentMonth(format(newDate, "MMM-yyyy"));
    //  setAnimationKey(crypto.randomUUID());
  }

  function toggleShowCalender() {
    setShowCalendarYears(!showCalendarYears);
  }

  let newDays: Date[] = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });

  useEffect(() => {
    changeYear(selectedYear);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear]);

  return (
    <div className="md:grid md:grid-cols-2 md:divide-x md:divide-gray-200">
      <div className="md:pr-14">
        <div className="flex items-center justify-between">
          <button
            onClick={toggleShowCalender}
            className=" flex gap-1  hover:bg-gray-50 px-2 py-1 rounded items-center text-sm font-semibold text-gray-900"
          >
            <span>{format(firstDayCurrentMonth, "MMMM yyyy")}</span>
            <span>
              <ChevronDownIcon
                className={clsx(
                  "h-5 w-5 transition-transform duration-300 text-gray-900",
                  {
                    "rotate-180": showCalendarYears,
                  }
                )}
                aria-hidden="true"
              />
            </span>
          </button>
          {!showCalendarYears && (
            <ChangeMonth previousMonth={previousMonth} nextMonth={nextMonth} />
          )}
        </div>
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

              // animationKey={animationKey}
            />
          )}
        </AnimatePresence>
      </div>
      <section className="mt-12 md:mt-0 md:pl-14">
        <h2 className="text-base font-semibold leading-6 text-gray-900">
          Schedule for <time dateTime="2022-01-21">January 21, 2022</time>
        </h2>
        <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500">
          {meetings.map((meeting) => (
            <li
              key={meeting.id}
              className="group flex items-center space-x-4 rounded-xl px-4 py-2 focus-within:bg-gray-100 hover:bg-gray-100"
            >
              <img
                src={meeting.imageUrl}
                alt=""
                className="h-10 w-10 flex-none rounded-full"
              />
              <div className="flex-auto">
                <p className="text-gray-900">{meeting.name}</p>
                <p className="mt-0.5">
                  <time dateTime={meeting.startDatetime}>{meeting.start}</time>{" "}
                  - <time dateTime={meeting.endDatetime}>{meeting.end}</time>
                </p>
              </div>
              <Menu
                as="div"
                className="relative opacity-0 focus-within:opacity-100 group-hover:opacity-100"
              >
                <div>
                  <Menu.Button className="-m-2 flex items-center rounded-full p-1.5 text-gray-500 hover:text-gray-600">
                    <span className="sr-only">Open options</span>
                    <EllipsisVerticalIcon
                      className="h-6 w-6"
                      aria-hidden="true"
                    />
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              active
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-700",
                              "block px-4 py-2 text-sm"
                            )}
                          >
                            Edit
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              active
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-700",
                              "block px-4 py-2 text-sm"
                            )}
                          >
                            Cancel
                          </a>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </li>
          ))}
        </ol>
      </section>
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
};
type CalenderYearsProps = {
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  toggleShowCalender: () => void;
};

function CalenderYears({
  selectedYear,
  setSelectedYear,
  toggleShowCalender,
}: CalenderYearsProps) {
  const years = eachYearOfInterval({
    start: new Date(1990, 0, 1),
    end: new Date(2025, 0, 1),
  });
  console.log({ years });
  return (
    <motion.section variants={toggleVariant} initial="hidden" animate="visible">
      <div className="grid mt-10 gap-3 grid-cols-4 h-[300px] overflow-y-auto">
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

function CalendarDates({
  setSelectedDay,
  selectedDay,
  firstDayCurrentMonth,
  newDays,
  isShowBackAnimation,
}: // animationKey
CalenderDatesProps) {
  return (
    <motion.section
      className="border"
      variants={toggleVariant}
      initial="hidden"
      animate="visible"
    >
      <div className="mt-10 grid grid-cols-7 text-center text-xs leading-6 text-gray-500">
        <div>S</div>
        <div>M</div>
        <div>T</div>
        <div>W</div>
        <div>T</div>
        <div>F</div>
        <div>S</div>
      </div>
      <ResizablePanel
        // showAnimation={isShowAnimation}
        isShowBackAnimation={isShowBackAnimation}
        animeKey={newDays[0].toISOString()}
      >
        <div className="mt-2  grid grid-cols-7 text-sm">
          {newDays.map((day, dayIdx) => (
            <div
              key={day.toString()}
              className={classNames(
                dayIdx > 6 && " border-gray-200",
                dayIdx === 0 && colStartClasses[getDay(day)],
                "py-2"
              )}
            >
              <button
                type="button"
                onClick={() => setSelectedDay(day)}
                className={clsx(
                  "mx-auto flex h-8 w-8 items-center justify-center rounded-full",
                  {
                    "text-white": isEqual(day, selectedDay),
                    "text-gray-900":
                      !isEqual(day, selectedDay) &&
                      isSameMonth(day, firstDayCurrentMonth),
                    "text-gray-400":
                      !isEqual(day, selectedDay) &&
                      !isSameMonth(day, firstDayCurrentMonth),
                    "bg-blue-600": isEqual(day, selectedDay),
                    "hover:bg-gray-200": !isEqual(day, selectedDay),
                    "font-semibold": isEqual(day, selectedDay),
                  }
                )}
              >
                <time dateTime={format(day, "yyyy-MM-dd")}>
                  {format(day, "d")}
                </time>
              </button>
            </div>
          ))}
        </div>
      </ResizablePanel>
    </motion.section>
  );
}

type ChangeMonthProps = {
  previousMonth: () => void;
  nextMonth: () => void;
};

function ChangeMonth({ previousMonth, nextMonth }: ChangeMonthProps) {
  return (
    <div className="flex ">
      <button
        onClick={previousMonth}
        type="button"
        className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
      >
        <span className="sr-only">Previous month</span>
        <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
      </button>
      <button
        onClick={nextMonth}
        type="button"
        className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
      >
        <span className="sr-only">Next month</span>
        <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  );
}
