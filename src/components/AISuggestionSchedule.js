import React, { useEffect, useState } from "react";
import useAiInputStore from "../stores/useAiInputStore";
import useScheduleStore from "../stores/useScheduleStore";
import { FaEdit, FaTrash, FaSave } from "react-icons/fa";
import { format, parseISO } from "date-fns";
import { reRequestAiSchedule } from "../api/scheduleAi/reRequestAiSchedule";

// 밝기 계산 함수
const isColorDark = (color) => {
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
};

const AISuggestionSchedule = () => {
  const { schedules, replaceSchedule, resetForm } = useAiInputStore();
  const { predefinedColors } = useScheduleStore();

  const [expandedDays, setExpandedDays] = useState({});
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [selectedColor, setSelectedColor] = useState(predefinedColors[0]);
  const [editingTask, setEditingTask] = useState(null);
  const [groupedSchedule, setGroupedSchedule] = useState([]);
  const [isReRequestLoading, setIsReRequestLoading] = useState(false);
  const [reRequestText, setReRequestText] = useState(""); // 재요청 내용

  useEffect(() => {
    // 날짜 기반으로 정렬
    const schedulesWithDates = schedules.flatMap((schedule) =>
      schedule.subSchedules.map((sub) => ({
        mainScheduleTitle: schedule.mainTitle,
        subScheduleTitle: sub.title,
        start_time: format(parseISO(sub.startTime), "HH:mm"),
        end_time: format(parseISO(sub.endTime), "HH:mm"),
        date: parseISO(sub.startTime),
        color: selectedColor,
      }))
    );

    // 날짜 순으로 정렬
    schedulesWithDates.sort((a, b) => a.date - b.date);

    // 날짜별로 그룹화
    const grouped = schedulesWithDates.reduce((acc, item) => {
      const dayName = format(item.date, "EEEE"); // 요일 이름
      if (!acc[dayName]) {
        acc[dayName] = [];
      }
      acc[dayName].push(item);
      return acc;
    }, {});

    // 그룹화된 데이터를 배열로 변환
    const groupedArray = Object.keys(grouped).map((dayName) => ({
      dayName,
      tasks: grouped[dayName],
    }));

    setGroupedSchedule(groupedArray);

    // 초기 expandedDays 설정
    const initialExpandedDays = {};
    groupedArray.forEach((_, index) => {
      initialExpandedDays[index] = true;
    });
    setExpandedDays(initialExpandedDays);
  }, [schedules, selectedColor]);

  const toggleDay = (dayIndex) => {
    setExpandedDays((prev) => ({
      ...prev,
      [dayIndex]: !prev[dayIndex],
    }));
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    const updatedSchedule = groupedSchedule.map((day) => ({
      ...day,
      tasks: day.tasks.map((task) => ({
        ...task,
        color,
      })),
    }));
    setGroupedSchedule(updatedSchedule);
    setColorPickerVisible(false);
  };

  const handleEditTask = (dayIndex, taskIndex) => {
    setEditingTask({
      dayIndex,
      taskIndex,
      ...groupedSchedule[dayIndex].tasks[taskIndex],
    });
  };

  const handleSaveTask = () => {
    if (editingTask === null) return;

    const updatedSchedule = [...groupedSchedule];
    const { dayIndex, taskIndex } = editingTask;
    updatedSchedule[dayIndex].tasks[taskIndex] = {
      ...updatedSchedule[dayIndex].tasks[taskIndex],
      subScheduleTitle: editingTask.subScheduleTitle,
      start_time: editingTask.start_time,
      end_time: editingTask.end_time,
    };

    setGroupedSchedule(updatedSchedule);
    setEditingTask(null);
  };

  const handleDeleteTask = (dayIndex, taskIndex) => {
    const updatedSchedule = [...groupedSchedule];
    updatedSchedule[dayIndex].tasks.splice(taskIndex, 1);
    setGroupedSchedule(updatedSchedule.filter((day) => day.tasks.length > 0));
  };

  const handleReRequest = async () => {
    const reRequestData = {
      originSchedule: JSON.stringify(schedules),
      newAdditionalRequest: reRequestText,
    };

    setIsReRequestLoading(true);
    try {
      const reGeneratedSchedule = await reRequestAiSchedule(reRequestData);

      // Zustand의 replaceSchedule 호출
      replaceSchedule({ result: "true", schedule: reGeneratedSchedule });

      resetForm(); // 폼 초기화
      setReRequestText("");
    } catch (error) {
      console.error("Re-request failed:", error);
      alert("재요청 실패: 다시 시도해주세요.");
    } finally {
      setIsReRequestLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md h-full overflow-y-auto relative">
      <h2 className="text-lg font-bold mb-4">아래와 같은 일정은 어떤가요?</h2>
      <div className="mb-4 flex items-center space-x-2 relative">
        <span className="text-sm text-gray-600">색상</span>
        <div
          className="w-8 h-8 rounded-full cursor-pointer border-[2px] border-gray-200"
          style={{ backgroundColor: selectedColor }}
          onClick={() => setColorPickerVisible(!colorPickerVisible)}
        ></div>
        {colorPickerVisible && (
          <div className="flex flex-wrap w-40 p-2 bg-white border-[2px] border-gray-300 rounded shadow-lg absolute z-20 top-10 left-0">
            {predefinedColors.map((color) => (
              <div
                key={color}
                className="w-6 h-6 m-1 rounded-full cursor-pointer"
                style={{ backgroundColor: color }}
                onClick={() => handleColorSelect(color)}
              ></div>
            ))}
          </div>
        )}
      </div>
      {groupedSchedule.map((day, dayIndex) => (
        <div key={dayIndex} className="mb-4">
          <div
            className="font-semibold text-[#4442b1] cursor-pointer flex justify-between items-center"
            onClick={() => toggleDay(dayIndex)}
          >
            {day.dayName}{" "}
            <span
              className={`transform transition-transform ${
                expandedDays[dayIndex] ? "rotate-180" : "rotate-0"
              }`}
            >
              ▼
            </span>
          </div>

          <div
            className={`overflow-hidden transition-all duration-300 ${
              expandedDays[dayIndex] ? "max-h-screen" : "max-h-0"
            }`}
          >
            {day.tasks.map((task, taskIndex) => (
              <div
                key={taskIndex}
                className="p-4 rounded mb-2 flex flex-col space-y-2 relative"
                style={{
                  backgroundColor: task.color,
                  color: isColorDark(task.color) ? "white" : "black",
                }}
              >
                <div className="absolute top-2 right-2 flex space-x-2">
                  {editingTask &&
                  editingTask.dayIndex === dayIndex &&
                  editingTask.taskIndex === taskIndex ? (
                    <FaSave
                      className="text-gray-400 hover:text-[#312a7a] cursor-pointer"
                      onClick={handleSaveTask}
                    />
                  ) : (
                    <FaEdit
                      className="text-gray-400 hover:text-[#312a7a] cursor-pointer"
                      onClick={() => handleEditTask(dayIndex, taskIndex)}
                    />
                  )}
                  <FaTrash
                    className="text-gray-400 hover:text-[#FF5733] cursor-pointer"
                    onClick={() => handleDeleteTask(dayIndex, taskIndex)}
                  />
                </div>
                <div className="text-sm flex justify-between items-center">
                  {editingTask &&
                  editingTask.dayIndex === dayIndex &&
                  editingTask.taskIndex === taskIndex ? (
                    <>
                      <input
                        type="time"
                        value={editingTask.start_time}
                        onChange={(e) =>
                          setEditingTask({
                            ...editingTask,
                            start_time: e.target.value,
                          })
                        }
                        className="border rounded px-2 py-1 text-sm text-black"
                      />
                      <input
                        type="time"
                        value={editingTask.end_time}
                        onChange={(e) =>
                          setEditingTask({
                            ...editingTask,
                            end_time: e.target.value,
                          })
                        }
                        className="border rounded px-2 py-1 text-sm text-black"
                      />
                    </>
                  ) : (
                    <>
                      {task.start_time} - {task.end_time}
                    </>
                  )}
                </div>
                <div className="text-gray-800 font-bold">
                  {editingTask &&
                  editingTask.dayIndex === dayIndex &&
                  editingTask.taskIndex === taskIndex ? (
                    <input
                      type="text"
                      value={editingTask.subScheduleTitle}
                      onChange={(e) =>
                        setEditingTask({
                          ...editingTask,
                          subScheduleTitle: e.target.value,
                        })
                      }
                      className="border rounded px-2 py-1 w-full text-black"
                    />
                  ) : (
                    task.subScheduleTitle
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="fixed bottom-0 left-0 w-full h-32 bg-white p-4 shadow-md flex items-center justify-between border-2 border-[#312a7a]">
        <textarea
          className="w-2/4 p-2 h-full border rounded text-sm"
          rows={2}
          placeholder="재요청 사항을 입력하세요."
          value={reRequestText}
          onChange={(e) => setReRequestText(e.target.value)}
        ></textarea>
        <button
          className="w-1/4 h-full border-2 border-[#312a7a] text-[#312a7a] rounded p-2 hover:opacity-80 transition flex justify-center items-center"
          onClick={handleReRequest}
        >
          {isReRequestLoading ? (
            <div className="animate-spin border-t-4 border-white border-solid rounded-full w-8 h-8"></div>
          ) : (
            "재요청"
          )}
        </button>
        <button className="w-1/4 h-full text-lg transition-all duration-150 bg-[#312a7a] text-white px-4 py-2 rounded hover:opacity-80">
          일정
          <br />
          반영
        </button>
      </div>
      <div className="pb-24"></div>
    </div>
  );
};

export default AISuggestionSchedule;
