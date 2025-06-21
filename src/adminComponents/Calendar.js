import { motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { format } from "date-fns";

const Calendar = ({
  weekDays,
  users,
  prevWeek,
  nextWeek,
  toggleMobileWeekNav,
  showMobileWeekNav,
  hoveredCell,
  setHoveredCell,
  selectedSchedule,
  setSelectedSchedule,
}) => {
  return (
    <div className="w-full xl:w-1/2 bg-white p-4 lg:p-6 rounded-xl shadow-xl border border-gray-200 flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 lg:mb-6 gap-3">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-800">
            Team Calendar
          </h2>
          <div className="text-sm text-gray-500 mt-1">
            {new Date().toLocaleString("id-ID", {
              timeZone: "Asia/Jakarta",
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              timeZoneName: "short",
            })}
          </div>
        </div>

        {/* Desktop Week Navigation */}
        <div className="hidden sm:flex items-center space-x-2">
          <button
            onClick={prevWeek}
            className="p-1 lg:p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition duration-200 shadow-sm"
          >
            <FiChevronLeft className="text-gray-700" size={18} />
          </button>
          <h3 className="text-sm lg:text-lg font-semibold text-gray-700 px-3 lg:px-4 py-1 bg-gray-100 rounded-md">
            {format(weekDays[0], "MMM d")} - {format(weekDays[6], "MMM d, yyyy")}
          </h3>
          <button
            onClick={nextWeek}
            className="p-1 lg:p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition duration-200 shadow-sm"
          >
            <FiChevronRight className="text-gray-700" size={18} />
          </button>
        </div>

        {/* Mobile Week Navigation */}
        <div className="sm:hidden w-full">
          <button
            onClick={toggleMobileWeekNav}
            className="w-full p-2 bg-gray-100 rounded-md text-sm font-medium flex justify-between items-center"
          >
            <span>
              {format(weekDays[0], "MMM d")} - {format(weekDays[6], "MMM d")}
            </span>
            <FiChevronRight
              className={`transition-transform ${
                showMobileWeekNav ? "rotate-90" : ""
              }`}
            />
          </button>

          {showMobileWeekNav && (
            <div className="mt-2 flex justify-between bg-gray-50 p-2 rounded-md">
              <button
                onClick={prevWeek}
                className="p-1 bg-gray-200 hover:bg-gray-300 rounded-full"
              >
                <FiChevronLeft size={16} />
              </button>
              <span className="text-sm font-medium text-gray-700">
                Week {format(weekDays[0], "w")}
              </span>
              <button
                onClick={nextWeek}
                className="p-1 bg-gray-200 hover:bg-gray-300 rounded-full"
              >
                <FiChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <table className="w-full min-w-[600px] border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
              <th className="p-2 lg:p-3 text-left rounded-tl-lg text-xs lg:text-sm">
                Team Member
              </th>
              {weekDays.map((day, index) => (
                <th key={index} className="p-1 lg:p-2 text-center">
                  <div className="flex flex-col items-center">
                    <span
                      className={`text-xs lg:text-sm font-medium ${
                        index === 0 ? "text-red-300" : "text-gray-300"
                      }`}
                    >
                      {format(day, "EEE").charAt(0)}
                    </span>
                    <span className="text-sm lg:text-base font-bold text-white">
                      {format(day, "d")}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <motion.tr
                key={user.username}
                className="border-b border-gray-100 hover:bg-gray-50"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.03 }}
              >
                <td className="p-2 lg:p-3 font-medium text-gray-700 flex items-center text-xs lg:text-sm">
                  <div
                    className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full ${
                      user.color
                    } flex items-center justify-center text-white font-bold mr-2 lg:mr-3 text-xs lg:text-sm`}
                  >
                    {user.avatar}
                  </div>
                  <div>
                    <div className="truncate max-w-[100px] lg:max-w-none">
                      {user.username}
                    </div>
                    <div className="text-gray-400 text-xs">{user.name}</div>
                  </div>
                </td>
                {weekDays.map((day, index) => {
                  const dayNum = parseInt(format(day, "d"));
                  const isScheduled = user.schedule.includes(dayNum);
                  const isHovered =
                    hoveredCell?.user === user.name && hoveredCell?.day === index;

                  return (
                    <td
                      key={index}
                      className="p-1 lg:p-2 text-center relative group"
                      onMouseEnter={() =>
                        setHoveredCell({ user: user.name, day: index })
                      }
                      onMouseLeave={() => setHoveredCell(null)}
                      onClick={() =>
                        isScheduled &&
                        setSelectedSchedule({
                          user: user.name,
                          date: format(day, "EEE, MMM d"),
                        })
                      }
                    >
                      <div
                        className={`w-6 h-6 lg:w-8 lg:h-8 mx-auto rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer
                          ${
                            isScheduled
                              ? `${user.color} text-white shadow-md transform hover:scale-110`
                              : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                          }
                          ${isHovered ? "ring-2 ring-offset-2 ring-gray-300" : ""}
                        `}
                      >
                        {isScheduled && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 bg-white rounded-full"
                          />
                        )}
                      </div>

                      {isHovered && isScheduled && (
                        <div className="hidden sm:block absolute z-10 top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 bg-white shadow-lg rounded-md border border-gray-200 text-xs font-medium whitespace-nowrap">
                          {user.name} - {format(day, "EEE, MMM d")}
                          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white border-t border-l border-gray-200 rotate-45"></div>
                        </div>
                      )}
                    </td>
                  );
                })}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="sm:hidden mt-4 text-xs text-gray-500 text-center">
        Tap on colored circles to view details
      </div>
    </div>
  );
};

export default Calendar;