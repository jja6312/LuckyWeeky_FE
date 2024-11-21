import React, { useEffect, useState } from "react";
import useAiInputStore from "../stores/useAiInputStore";
import useScheduleStore from "../stores/useScheduleStore";
import { FaEdit, FaTrash, FaSave } from "react-icons/fa";
import { format, parseISO } from "date-fns";

// 밝기 계산 함수
const isColorDark = (color) => {
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  // 밝기 공식
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128; // 밝기가 낮으면 어두운 색상
};

const AISuggestionSchedule = () => {
  const { schedules } = useAiInputStore();
  const { predefinedColors } = useScheduleStore();

  const [expandedDays, setExpandedDays] = useState({});
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [selectedColor, setSelectedColor] = useState(predefinedColors[0]); // 기본 색상
  const [editingTask, setEditingTask] = useState(null); // 현재 수정 중인 task
  const [groupedSchedule, setGroupedSchedule] = useState([]); // 요일별로 변환된 스케줄

  useEffect(() => {
    // schedules 데이터를 요일별로 변환
    const grouped = [
      { dayName: "Monday", tasks: [] },
      { dayName: "Tuesday", tasks: [] },
      { dayName: "Wednesday", tasks: [] },
      { dayName: "Thursday", tasks: [] },
      { dayName: "Friday", tasks: [] },
      { dayName: "Saturday", tasks: [] },
      { dayName: "Sunday", tasks: [] },
    ];

    schedules.forEach((schedule) => {
      schedule.subSchedules.forEach((sub) => {
        const dayIndex = parseISO(sub.startTime).getDay(); // 요일 index
        grouped[dayIndex].tasks.push({
          mainScheduleTitle: schedule.mainTitle,
          subScheduleTitle: sub.title,
          start_time: format(parseISO(sub.startTime), "HH:mm"), // 시간만 추출
          end_time: format(parseISO(sub.endTime), "HH:mm"), // 시간만 추출
          color: selectedColor,
        });
      });
    });

    setGroupedSchedule(grouped.filter((day) => day.tasks.length > 0)); // 스케줄이 없는 요일 제거

    // 모든 요일 기본 열림 상태 설정
    const initialExpandedDays = {};
    grouped.forEach((day, index) => {
      initialExpandedDays[index] = true; // 기본 열림 상태로 설정
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

    // 선택된 색상으로 모든 task 색상 업데이트
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
    setGroupedSchedule(
      updatedSchedule.filter((day) => day.tasks.length > 0) // 스케줄 없는 요일 제거
    );
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md h-full overflow-y-auto relative">
      <h2 className="text-lg font-bold mb-4">아래와 같은 일정은 어떤가요?</h2>
      {/* 색상 선택 */}
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
                  color: isColorDark(task.color) ? "white" : "black", // 글자색 조정
                }}
              >
                {/* 수정 및 삭제 버튼 */}
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

                {/* Start & End Time */}
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

                {/* Task Title */}
                <div className="text-gray-800 font-bold flex justify-between items-center">
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
      {/* 고정 버튼 영역 */}
      <div className="fixed bottom-0 left-0 w-full h-32 bg-white p-4 shadow-md flex items-center justify-between border-2 border-[#312a7a]">
        <textarea
          className="w-2/4 p-2 h-full border rounded text-sm"
          rows={2}
          placeholder="재요청 사항을 입력하세요."
        ></textarea>
        <button className="w-1/4 h-full text-lg transition-all duration-150  text-[#312a7a] border-2 border-[#bdbadd] px-4 py-2 rounded hover:bg-[#dcdaf3]">
          재요청
        </button>
        <button className="w-1/4 h-full text-lg transition-all duration-150 bg-[#312a7a] text-white px-4 py-2 rounded hover:opacity-80">
          일정<br></br>반영
        </button>
      </div>
      <div className="pb-24"></div>{" "}
      {/* 마지막 요소가 가려지지 않도록 공간 추가 */}
    </div>
  );
};

export default AISuggestionSchedule;
