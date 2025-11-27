import React, { useState, useRef } from 'react';
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
import { vi } from 'date-fns/locale';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  X,
  Calendar as CalendarIcon,
  Image as ImageIcon,
  Check,
} from 'lucide-react';
import styles from './Calendar.module.scss';

// --- TYPE DEFINITIONS ---
export interface Task {
  id: string;
  title: string;
  date: Date;
  completed: boolean;
  // Các trường mới theo design
  description?: string;
  priority?: 'Extreme' | 'Moderate' | 'Low';
  image?: string;
}

// Mock Data Ban đầu
const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Họp team',
    date: new Date(),
    completed: false,
    priority: 'Moderate',
    description: 'Họp hàng tuần',
  },
];

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State quản lý View trong Modal: 'list' | 'form'
  const [modalView, setModalView] = useState<'list' | 'form'>('list');

  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    priority: 'Extreme' | 'Moderate' | 'Low';
    image: string | null;
  }>({
    title: '',
    description: '',
    priority: 'Low',
    image: null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- LOGIC LỊCH ---
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

  // --- HANDLERS ---
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    setModalView('list'); // Mặc định mở ra là xem list
    setIsModalOpen(true);
  };

  const tasksForSelectedDate = tasks.filter(
    (t) => selectedDate && isSameDay(t.date, selectedDate)
  );

  // Chuyển sang chế độ Thêm mới
  const handleOpenAddForm = () => {
    setEditingId(null);
    setFormData({ title: '', description: '', priority: 'Low', image: null });
    setModalView('form');
  };

  // Chuyển sang chế độ Sửa
  const handleOpenEditForm = (task: Task) => {
    setEditingId(task.id);
    setFormData({
      title: task.title,
      description: task.description || '',
      priority: task.priority || 'Low',
      image: task.image || null,
    });
    setModalView('form');
  };

  // Upload Ảnh
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData({ ...formData, image: url });
    }
  };

  const handleSave = () => {
    // Validate cơ bản
    if (!formData.title.trim() || !selectedDate) return;

    // Chuẩn bị dữ liệu để lưu (convert image null -> undefined để khớp type Task)
    const taskPayload = {
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      image: formData.image || undefined, // <--- SỬA LỖI Ở ĐÂY
    };

    if (editingId) {
      // Logic Update
      setTasks((prev) =>
        prev.map((t) => (t.id === editingId ? { ...t, ...taskPayload } : t))
      );
    } else {
      // Logic Create
      const newTask: Task = {
        id: Date.now().toString(),
        date: selectedDate,
        completed: false,
        ...taskPayload,
      };
      setTasks([...tasks, newTask]);
    }

    // Quay về list sau khi save
    setModalView('list');
  };

  const handleDeleteTask = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa?')) {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    }
  };

  // --- RENDER HELPERS ---

  // 1. Render View: Danh sách Task (Giao diện cũ nhưng cleanup lại)
  const renderListView = () => (
    <>
      <div className={styles.modalHeader} style={{ borderBottom: 'none' }}>
        <h3>
          Công việc ngày {selectedDate && format(selectedDate, 'dd/MM/yyyy')}
        </h3>
        <button onClick={() => setIsModalOpen(false)}>
          <X size={20} />
        </button>
      </div>

      <div className={styles.listViewHeader}>
        <span>{tasksForSelectedDate.length} công việc</span>
        <button className={styles.addNewBtn} onClick={handleOpenAddForm}>
          <Plus size={16} /> Thêm mới
        </button>
      </div>

      <ul className={styles.taskList}>
        {tasksForSelectedDate.length === 0 && (
          <p className={styles.emptyText}>Chưa có công việc nào.</p>
        )}
        {tasksForSelectedDate.map((task) => (
          <li key={task.id} className={styles.taskItem}>
            <div
              style={{ flex: 1, cursor: 'pointer' }}
              onClick={() => handleOpenEditForm(task)}
            >
              <div style={{ fontWeight: 600 }}>{task.title}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>
                {task.priority} •{' '}
                {task.description ? 'Có mô tả' : 'Không mô tả'}
              </div>
            </div>
            <button
              className={styles.deleteBtn}
              onClick={() => handleDeleteTask(task.id)}
            >
              <Trash2 size={16} />
            </button>
          </li>
        ))}
      </ul>
    </>
  );

  // 2. Render View: Form (Giao diện mới theo Design)
  const renderFormView = () => (
    <>
      <div className={styles.formHeader}>
        <h3>{editingId ? 'Edit Task' : 'Add New Task'}</h3>
        <button
          className={styles.goBackBtn}
          onClick={() => setModalView('list')}
        >
          Go Back
        </button>
      </div>

      <div className={styles.formBody}>
        {/* Hàng 1: Title */}
        <div className={styles.formGroup}>
          <label>Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Enter task title"
          />
        </div>

        {/* Hàng 2: Date */}
        <div className={styles.formGroup}>
          <label>Date</label>
          <div className={styles.dateDisplay}>
            <span>
              {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : ''}
            </span>
            <CalendarIcon size={18} />
          </div>
        </div>

        {/* Hàng 3: Priority */}
        <div className={styles.formGroup}>
          <label>Priority</label>
          <div className={styles.priorityGroup}>
            {[
              { label: 'Extreme', color: '#ef4444', value: 'Extreme' },
              { label: 'Moderate', color: '#3b82f6', value: 'Moderate' },
              { label: 'Low', color: '#22c55e', value: 'Low' },
            ].map((option) => (
              <div
                key={option.value}
                className={`${styles.priorityOption} ${
                  formData.priority === option.value ? styles.active : ''
                }`}
                onClick={() =>
                  setFormData({ ...formData, priority: option.value as any })
                }
              >
                <span
                  className={styles.dot}
                  style={{ backgroundColor: option.color }}
                />
                <span>{option.label}</span>
                <div className={styles.checkbox}>
                  {formData.priority === option.value && (
                    <Check size={12} color="white" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hàng 4: 2 Cột (Desc & Image) */}
        <div className={styles.formRow}>
          <div className={styles.leftColumn}>
            <div className={styles.formGroup}>
              <label>Task Description</label>
              <textarea
                placeholder="Start writing here..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </div>

          <div className={styles.rightColumn}>
            <div className={styles.formGroup}>
              <label>Upload Image</label>
              <div
                className={styles.uploadBox}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  hidden
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {formData.image ? (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className={styles.previewImage}
                  />
                ) : (
                  <>
                    <ImageIcon size={32} className={styles.uploadIcon} />
                    <p>
                      Drag&Drop files here <b>Or</b>
                    </p>
                    <button className={styles.browseBtn}>Browse</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Nút Done */}
        <button className={styles.doneBtn} onClick={handleSave}>
          Done
        </button>
      </div>
    </>
  );

  // --- MAIN RENDER ---
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: 30,
      }}
    >
      <div className={styles.calendarContainer}>
        {/* HEADER LỊCH */}
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

        {/* GRID THỨ */}
        <div className={styles.weekDaysGrid}>
          {weekDays.map((day) => (
            <div key={day} className={styles.weekDayCell}>
              {day}
            </div>
          ))}
        </div>

        {/* GRID NGÀY */}
        <div className={styles.daysGrid}>
          {calendarDays.map((day, index) => {
            const dayTasks = tasks.filter((t) => isSameDay(t.date, day));
            const isCurrentMonth = isSameMonth(day, monthStart);
            return (
              <div
                key={index}
                className={`${styles.dayCell} 
                  ${!isCurrentMonth ? styles.disabled : ''} 
                  ${isToday(day) ? styles.today : ''}`}
                onClick={() => handleDayClick(day)}
              >
                <div className={styles.dateNumber}>{format(day, 'd')}</div>
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

        {/* MODAL */}
        {isModalOpen && selectedDate && (
          <div
            className={styles.modalOverlay}
            onClick={() => setIsModalOpen(false)}
          >
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              {/* ĐIỀU KIỆN RENDER: LIST HOẶC FORM */}
              {modalView === 'list' ? renderListView() : renderFormView()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;
