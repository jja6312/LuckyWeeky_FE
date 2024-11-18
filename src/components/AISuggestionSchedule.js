import React, { useEffect, useState } from "react";
import useAiInputStore from "../stores/useAiInputStore";
import useScheduleStore from "../stores/useScheduleStore";
import { FaEdit, FaTrash, FaSave } from "react-icons/fa";

const AISuggestionSchedule = () => {
  const { dummySchedule, generateDummySchedule, formData, updateTaskColors } =
    useAiInputStore();
  const { predefinedColors } = useScheduleStore();

  const [expandedDays, setExpandedDays] = useState({});
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [selectedColor, setSelectedColor] = useState(predefinedColors[0]); // 기본 색상
  const [editingTask, setEditingTask] = useState(null); // 현재 수정 중인 task

  useEffect(() => {
    if (formData?.startDateTime && formData?.endDateTime) {
      generateDummySchedule();
    } else {
      console.warn("Invalid formData. Skipping schedule generation.");
    }
  }, [formData.startDateTime, formData.endDateTime, generateDummySchedule]);

  useEffect(() => {
    const initialExpandedDays = {};
    dummySchedule.forEach((day, index) => {
      initialExpandedDays[index] = day.tasks.length > 0; // 일정이 있는 요일 펼침
    });
    setExpandedDays(initialExpandedDays);
  }, [dummySchedule]);

  const toggleDay = (dayIndex) => {
    setExpandedDays((prev) => ({
      ...prev,
      [dayIndex]: !prev[dayIndex],
    }));
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    updateTaskColors(color); // 즉시 모든 일정의 색상을 업데이트
    setColorPickerVisible(false);
  };

  const handleEditTask = (task) => {
    setEditingTask({ ...task });
  };

  const handleSaveTask = (dayIndex, taskIndex) => {
    const updatedSchedule = [...dummySchedule];
    updatedSchedule[dayIndex].tasks[taskIndex] = editingTask;
    setEditingTask(null);
  };

  const handleDeleteTask = (dayIndex, taskIndex) => {
    const updatedSchedule = [...dummySchedule];
    updatedSchedule[dayIndex].tasks.splice(taskIndex, 1);
    setExpandedDays((prev) => ({
      ...prev,
      [dayIndex]: updatedSchedule[dayIndex].tasks.length > 0,
    }));
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
      {dummySchedule?.map((day, dayIndex) => (
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
                className="p-4 rounded mb-2 flex flex-col space-y-2"
                style={{ backgroundColor: task.color || selectedColor }}
              >
                {/* Start & End Time */}
                <div className="text-sm text-gray-500 flex justify-between items-center">
                  {editingTask &&
                  editingTask.subScheduleTitle === task.subScheduleTitle ? (
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
                        className="border rounded px-2 py-1 text-sm"
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
                        className="border rounded px-2 py-1 text-sm"
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
                  editingTask.subScheduleTitle === task.subScheduleTitle ? (
                    <input
                      type="text"
                      value={editingTask.subScheduleTitle}
                      onChange={(e) =>
                        setEditingTask({
                          ...editingTask,
                          subScheduleTitle: e.target.value,
                        })
                      }
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    task.subScheduleTitle
                  )}
                  <div className="space-x-2 flex">
                    {editingTask &&
                    editingTask.subScheduleTitle === task.subScheduleTitle ? (
                      <FaSave
                        className="text-gray-400 hover:text-[#312a7a] cursor-pointer"
                        onClick={() => handleSaveTask(dayIndex, taskIndex)}
                      />
                    ) : (
                      <FaEdit
                        className="text-gray-400 hover:text-[#312a7a] cursor-pointer"
                        onClick={() => handleEditTask(task)}
                      />
                    )}
                    <FaTrash
                      className="text-gray-400 hover:text-[#FF5733] cursor-pointer"
                      onClick={() => handleDeleteTask(dayIndex, taskIndex)}
                    />
                  </div>
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
