import { addDays, format, isToday } from "date-fns";

const WeekHeader = ({ startOfCurrentWeek }) => {
  return (
    <div
      className="grid border-b sticky top-0 bg-white z-10"
      style={{
        gridTemplateColumns: "102.4px repeat(7, minmax(0, 1fr))",
        boxSizing: "border-box",
      }}
    >
      <div className="border-r h-16"></div>
      {[...Array(7)].map((_, index) => {
        const day = addDays(startOfCurrentWeek, index);
        const isCurrentDay = isToday(day);

        return (
          <div
            key={index}
            className="border-r text-center h-16 flex items-center justify-center"
          >
            <div className="flex justify-center items-center">
              <span
                className={`text-sm ${
                  isCurrentDay ? "font-bold text-black" : "text-gray-500"
                }`}
              >
                {format(day, "EEE")}
              </span>
              <div
                className={`flex items-center justify-center rounded-full w-6 h-6 ${
                  isCurrentDay ? "ml-2 bg-blue-500 text-white font-bold" : ""
                }`}
              >
                <span
                  className={`text-sm ${isCurrentDay ? "" : "text-gray-500"}`}
                >
                  {format(day, "d")}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WeekHeader;
