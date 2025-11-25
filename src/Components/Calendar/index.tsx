import React, { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
} from 'date-fns';
import { vi } from 'date-fns/locale'; // Import locale tiếng Việt nếu cần
import { ChevronLeft, ChevronRight, Plus, Trash2, X } from 'lucide-react';
import styles from './Calendar.module.scss';

// --- TYPE DEFINITIONS ---
export interface Task {
  id: string;
  title: string;
  date: Date;
  completed: boolean;
}

// --- COMPONENT CHÍNH ---
const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock Data: State lưu trữ danh sách công việc
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Họp team', date: new Date(), completed: false },
  ]);

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskInput, setTaskInput] = useState('');

  // --- LOGIC TÍNH TOÁN LỊCH ---
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Bắt đầu từ Thứ 2
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

  // --- HANDLERS ---
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    setTaskInput('');
    setEditingTask(null);
    setIsModalOpen(true);
  };

  // Lọc task của ngày được chọn
  const tasksForSelectedDate = tasks.filter(
    (t) => selectedDate && isSameDay(t.date, selectedDate)
  );

  const handleSaveTask = () => {
    if (!taskInput.trim() || !selectedDate) return;

    if (editingTask) {
      // Update logic
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editingTask.id ? { ...t, title: taskInput } : t
        )
      );
    } else {
      // Create logic
      const newTask: Task = {
        id: Math.random().toString(36).substr(2, 9),
        title: taskInput,
        date: selectedDate,
        completed: false,
      };
      setTasks([...tasks, newTask]);
    }
    setTaskInput('');
    setEditingTask(null);
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setTaskInput(task.title);
  };

  return (
    <div className={styles.calendarContainer}>
      {/* HEADER: Tháng/Năm & Điều hướng */}
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <h2>{format(currentDate, 'MMMM yyyy', { locale: vi })}</h2>
        </div>
        <div className={styles.navButtons}>
          <button onClick={prevMonth}>
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => setCurrentDate(new Date())}>Hôm nay</button>
          <button onClick={nextMonth}>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* GRID: Các thứ trong tuần */}
      <div className={styles.weekDaysGrid}>
        {weekDays.map((day) => (
          <div key={day} className={styles.weekDayCell}>
            {day}
          </div>
        ))}
      </div>

      {/* GRID: Các ngày */}
      <div className={styles.daysGrid}>
        {calendarDays.map((day, index) => {
          // Lọc task hiển thị trên ô lịch (chỉ hiện tối đa 2 task để gọn)
          const dayTasks = tasks.filter((t) => isSameDay(t.date, day));
          const isCurrentMonth = isSameMonth(day, monthStart);

          return (
            <div
              key={index}
              className={`${styles.dayCell} 
                ${!isCurrentMonth ? styles.disabled : ''} 
                ${isToday(day) ? styles.today : ''}
                ${
                  isSameDay(day, selectedDate || new Date(0))
                    ? styles.selected
                    : ''
                }
              `}
              onClick={() => handleDayClick(day)}
            >
              <div className={styles.dateNumber}>{format(day, 'd')}</div>

              {/* Task Dots / Preview */}
              <div className={styles.taskPreviewList}>
                {dayTasks.slice(0, 2).map((t) => (
                  <div key={t.id} className={styles.taskDot} title={t.title}>
                    {t.title}
                  </div>
                ))}
                {dayTasks.length > 2 && (
                  <div className={styles.moreTasks}>
                    +{dayTasks.length - 2} nữa
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: Thêm/Sửa Task */}
      {isModalOpen && selectedDate && (
        <div
          className={styles.modalOverlay}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3>Công việc ngày {format(selectedDate, 'dd/MM/yyyy')}</h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className={styles.modalBody}>
              {/* List các task hiện có */}
              <ul className={styles.taskList}>
                {tasksForSelectedDate.length === 0 && (
                  <p className={styles.emptyText}>Chưa có công việc nào.</p>
                )}
                {tasksForSelectedDate.map((task) => (
                  <li key={task.id} className={styles.taskItem}>
                    <span
                      onClick={() => handleEditClick(task)}
                      className={
                        editingTask?.id === task.id ? styles.editing : ''
                      }
                    >
                      {task.title}
                    </span>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </li>
                ))}
              </ul>

              {/* Form input */}
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  placeholder={
                    editingTask ? 'Sửa công việc...' : 'Thêm công việc mới...'
                  }
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveTask()}
                  autoFocus
                />
                <button className={styles.addBtn} onClick={handleSaveTask}>
                  {editingTask ? 'Lưu' : <Plus size={18} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
