"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Upload,
  Plus,
  X,
  Calendar,
  Target,
  DollarSign,
  Users,
  Clock,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { campaignTypes, campaignGoals } from "../../assets/mock.js";
import InfluencerSelection from "./InfluencerSelection";
import CampaignApproval from "./CampaignApproval";
import { get, post, upload } from "../../utils/service";
import { toast } from "sonner";
import {
  calculateMinimumBudget,
  getMinBudgetPerInfluencer,
  calculatePlatformFee,
  localDateToUTC,
  generateRequestId,
} from "./utils";

// Date utilities
const createLocalDate = (dateString) => {
  if (!dateString) return null;
  try {
    const [day, month, year] = dateString.split('/');
    return new Date(year, month - 1, day);
  } catch {
    return null;
  }
};

const formatDateString = (date) => {
  if (!date) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const formatDisplayDate = (dateString) => {
  if (!dateString) return '';
  try {
    const [day, month, year] = dateString.split('/');
    return `${day}/${month}/${year}`;
  } catch {
    return dateString;
  }
};

const isDateDisabled = (date, minDate, maxDate) => {
  if (!date) return true;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (date < today) return true;
  if (minDate && date < minDate) return true;
  if (maxDate && date > maxDate) return true;
  
  return false;
};

const isToday = (date) => {
  const today = new Date();
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
};

const getMinimumDate = (daysFromNow = 3) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date;
};

const validateDateRange = (startDate, endDate, minDuration = 1) => {
  const errors = {};
  
  if (!startDate) {
    errors.startDate = 'Start date is required';
  }
  
  if (!endDate) {
    errors.endDate = 'End date is required';
  }
  
  if (startDate && endDate) {
    const start = createLocalDate(startDate);
    const end = createLocalDate(endDate);
    
    if (start && end) {
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < minDuration) {
        errors.endDate = `Campaign must run for at least ${minDuration} day${minDuration > 1 ? 's' : ''}`;
      }
      
      if (end < start) {
        errors.endDate = 'End date cannot be before start date';
      }
    }
  }
  
  return { isValid: Object.keys(errors).length === 0, errors };
};

const SkeletonCard = () => (
  <div className="animate-pulse">
    <div className="h-10 bg-gray-200 rounded mb-4"></div>
    <div className="h-32 bg-gray-200 rounded mb-4"></div>
    <div className="h-10 bg-gray-200 rounded mb-4"></div>
    <div className="h-10 bg-gray-200 rounded"></div>
  </div>
);

const DatePicker = ({ value, onChange, placeholder = "dd/mm/yyyy", minDate, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || "");
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const datePickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (value) {
      setInputValue(value);
      try {
        const [day, month, year] = value.split("/");
        if (day && month && year) {
          const date = new Date(year, month - 1, day);
          setSelectedDate(date);
          setCurrentMonth(date);
        }
      } catch (e) {}
    }
  }, [value]);

  const handleDateSelect = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const formatted = `${day}/${month}/${year}`;

    setInputValue(formatted);
    setSelectedDate(date);
    onChange(formatted);
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    onChange(val);
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentMonth(newDate);
  };

  const generateCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const days = generateCalendar();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="relative" ref={datePickerRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex h-10 w-full items-center justify-between rounded-md border bg-gray-100 px-3 py-2 text-xs cursor-pointer hover:border-gray-400 focus-within:border-yellow-400 focus-within:ring-2 focus-within:ring-yellow-200 transition-all ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      >
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="flex-1 bg-transparent border-none text-xs placeholder:text-gray-500 focus:outline-none"
          onClick={(e) => e.stopPropagation()}
        />
        <Calendar className="h-4 w-4 text-gray-400" />
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-72">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-4 w-4 text-gray-600" />
            </button>
            <h3 className="text-xs font-semibold text-gray-900">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <ChevronRight className="h-4 w-4 text-gray-600" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-gray-500 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((date, index) => {
              if (!date) {
                return <div key={index} className="p-2"></div>;
              }

              const isSelected =
                selectedDate &&
                date.getDate() === selectedDate.getDate() &&
                date.getMonth() === selectedDate.getMonth() &&
                date.getFullYear() === selectedDate.getFullYear();
              const isTodayDate = isToday(date);
              const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
              const isDisabled = isDateDisabled(date, minDate);

              return (
                <button
                  key={index}
                  onClick={() => !isDisabled && handleDateSelect(date)}
                  className={cn(
                    "text-xs p-2 rounded-lg transition-colors",
                    !isCurrentMonth && "text-gray-300",
                    isCurrentMonth && !isDisabled && "text-gray-700 hover:bg-gray-100",
                    isSelected && "bg-blue-500 text-white hover:bg-blue-600 font-semibold",
                    isTodayDate && !isSelected && !isDisabled && "bg-gray-100 text-gray-800 font-medium",
                    isDisabled && "text-gray-300 cursor-not-allowed"
                  )}
                  disabled={isDisabled}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
      {error && (
        <p className="text-xs text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
};

const TaskItem = ({ task, onUpdate, onRemove, canRemove = true }) => {
  return (
    <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-md">
      <input
        type="text"
        value={task}
        onChange={(e) => onUpdate(e.target.value)}
        className="flex-1 bg-transparent border-none text-xs focus:outline-none text-gray-900"
        placeholder="Task description"
      />
      {canRemove && (
        <button
          onClick={onRemove}
          className="p-1 hover:bg-gray-200 rounded transition-colors"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>
      )}
    </div>
  );
};

const ProfessionalDropdown = ({
  value,
  placeholder,
  options,
  onSelect,
  isOpen,
  onToggle,
  renderOption,
  className = "",
}) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={onToggle}
        className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-xs hover:border-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 focus:outline-none transition-all"
      >
        <span className={value ? "text-gray-900" : "text-gray-500"}>
          {value || placeholder}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-40 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => onSelect(option)}
              className="w-full px-3 py-2 text-xs text-left hover:bg-gray-50 transition-colors first:rounded-t-md last:rounded-b-md"
            >
              {renderOption ? renderOption(option) : option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Enhanced Task Dialog Component
const TaskDialog = ({
  isOpen,
  onClose,
  newTask,
  setNewTask,
  onAddTask,
  editingTaskIndex,
  socialSites
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (!isOpen) return null;

  const isRepetitive = newTask.task_type === "repetitive";

  const handleDescriptionChange = (value) => {
    setNewTask(prev => ({ ...prev, description: value }));
  };

  // Mobile Drawer
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 flex items-end">
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="relative z-50 w-full bg-white rounded-t-xl max-h-[80vh] flex flex-col">
          <div className="flex-shrink-0 p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingTaskIndex !== null ? "Edit Task" : "Add New Task"}
              </h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Task Title *
                </label>
                <input
                  type="text"
                  value={newTask.task}
                  onChange={(e) =>
                    setNewTask((prev) => ({ ...prev, task: e.target.value }))
                  }
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition-colors text-xs"
                  placeholder="e.g., Create Instagram post showcasing our product"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Task Description *
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => handleDescriptionChange(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition-colors text-xs resize-none"
                  placeholder="Provide detailed instructions for what the creator needs to do..."
                />
              </div>

              <div className={`grid gap-4 ${
                isRepetitive ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'
              }`}>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    Target Platform *
                  </label>
                  <select
                    value={newTask.site_id}
                    onChange={(e) =>
                      setNewTask((prev) => ({
                        ...prev,
                        site_id: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition-colors text-xs bg-white"
                    required
                  >
                    <option value="">Select Platform</option>
                    {socialSites.map((site) => (
                      <option key={site.site_id} value={site.site_id}>
                        {site.sm_name || site.site_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    Task Type *
                  </label>
                  <select
                    value={newTask.task_type}
                    onChange={(e) =>
                      setNewTask((prev) => ({
                        ...prev,
                        task_type: e.target.value,
                        repeats_after: e.target.value === "one_time" ? "" : prev.repeats_after
                      }))
                    }
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition-colors text-xs bg-white"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="one_time">One-time</option>
                    <option value="repetitive">Repetitive</option>
                  </select>
                </div>

                {isRepetitive && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      Repeat Frequency *
                    </label>
                    <select
                      value={newTask.repeats_after}
                      onChange={(e) =>
                        setNewTask((prev) => ({
                          ...prev,
                          repeats_after: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition-colors text-xs bg-white"
                      required={isRepetitive}
                    >
                      <option value="">Select Frequency</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="requires_url"
                  checked={newTask.requires_url}
                  onChange={(e) =>
                    setNewTask((prev) => ({
                      ...prev,
                      requires_url: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 rounded border-gray-300 text-yellow-400 focus:ring-yellow-400"
                />
                <label htmlFor="requires_url" className="text-xs text-gray-700">
                  Requires URL submission (post link, story link, etc.)
                </label>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={onAddTask}
                disabled={
                  !newTask.task.trim() || 
                  !newTask.description.trim() || 
                  !newTask.site_id || 
                  !newTask.task_type ||
                  (isRepetitive && !newTask.repeats_after)
                }
                className="flex-1 px-4 py-3 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                {editingTaskIndex !== null ? "Update Task" : "Add Task"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop Modal
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {editingTaskIndex !== null ? "Edit Task" : "Add New Task"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Task Title *
            </label>
            <input
              type="text"
              value={newTask.task}
              onChange={(e) =>
                setNewTask((prev) => ({ ...prev, task: e.target.value }))
              }
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition-colors text-xs"
              placeholder="e.g., Create Instagram post showcasing our product"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Task Description *
            </label>
            <textarea
              value={newTask.description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              rows={4}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition-colors text-xs resize-none"
              placeholder="Provide detailed instructions for what the creator needs to do..."
            />
          </div>

          <div className={`grid gap-4 ${
            isRepetitive ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'
          }`}>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Target Platform *
              </label>
              <select
                value={newTask.site_id}
                onChange={(e) =>
                  setNewTask((prev) => ({
                    ...prev,
                    site_id: e.target.value,
                  }))
                }
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition-colors text-xs bg-white"
                required
              >
                <option value="">Select Platform</option>
                {socialSites.map((site) => (
                  <option key={site.site_id} value={site.site_id}>
                    {site.sm_name || site.site_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Task Type *
              </label>
              <select
                value={newTask.task_type}
                onChange={(e) =>
                  setNewTask((prev) => ({
                    ...prev,
                    task_type: e.target.value,
                    repeats_after: e.target.value === "one_time" ? "" : prev.repeats_after
                  }))
                }
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition-colors text-xs bg-white"
                required
              >
                <option value="">Select Type</option>
                <option value="one_time">One-time</option>
                <option value="repetitive">Repetitive</option>
              </select>
            </div>

            {isRepetitive && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Repeat Frequency *
                </label>
                <select
                  value={newTask.repeats_after}
                  onChange={(e) =>
                    setNewTask((prev) => ({
                      ...prev,
                      repeats_after: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition-colors text-xs bg-white"
                  required={isRepetitive}
                >
                  <option value="">Select Frequency</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="requires_url"
              checked={newTask.requires_url}
              onChange={(e) =>
                setNewTask((prev) => ({
                  ...prev,
                  requires_url: e.target.checked,
                }))
              }
              className="w-4 h-4 rounded border-gray-300 text-yellow-400 focus:ring-yellow-400"
            />
            <label htmlFor="requires_url" className="text-xs text-gray-700">
              Requires URL submission (post link, story link, etc.)
            </label>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onAddTask}
            disabled={
              !newTask.task.trim() || 
              !newTask.description.trim() || 
              !newTask.site_id || 
              !newTask.task_type ||
              (isRepetitive && !newTask.repeats_after)
            }
            className="flex-1 px-4 py-3 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            {editingTaskIndex !== null ? "Update Task" : "Add Task"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function CampaignForm({
  onBack,
  selectedBusiness = null,
  onCreateCampaign,
  onSaveAsDraft,
}) {
  const [currentStep, setCurrentStep] = useState("form");
  const [loading, setLoading] = useState(false);
  const [loadingBusinesses, setLoadingBusinesses] = useState(true);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [businesses, setBusinesses] = useState([]);
  const [campaignSettings, setCampaignSettings] = useState(null);
  const [draftCampaignId, setDraftCampaignId] = useState("");
  const [socialSites, setSocialSites] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    createdFor: selectedBusiness?.business_id || "",
    type: "",
    description: "",
    image: null,
    imagePreview: null,
    budget: "",
    targetAudience: "",
    startDate: "",
    endDate: "",
    goals: "",
    tasks: [],
  });

  const [selectedInfluencersData, setSelectedInfluencersData] = useState(null);
  const [errors, setErrors] = useState({});
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  const [editingTaskIndex, setEditingTaskIndex] = useState(null);
  const [dateErrors, setDateErrors] = useState({});

  const [newTask, setNewTask] = useState({
    task: "",
    description: "",
    requires_url: true,
    site_id: "",
    task_type: "",
    repeats_after: "",
  });

  // Fetch social sites
  useEffect(() => {
    const fetchSocialSites = async () => {
      try {
        const response = await get("users/socialSites");
        if (response?.status === 200 && response?.data) {
          setSocialSites(response.data);
        }
      } catch (error) {
        console.error("Error fetching social sites:", error);
        setSocialSites([
          { site_id: 1, site_name: "Facebook", sm_name: "Facebook" },
          { site_id: 2, site_name: "Twitter", sm_name: "Twitter" },
          { site_id: 3, site_name: "LinkedIn", sm_name: "LinkedIn" },
          { site_id: 4, site_name: "Instagram", sm_name: "Instagram" },
          { site_id: 5, site_name: "TikTok", sm_name: "TikTok" },
          { site_id: 6, site_name: "YouTube", sm_name: "YouTube" },
        ]);
      }
    };

    fetchSocialSites();
  }, []);

  useEffect(() => {
    const fetchCampaignSettings = async () => {
      try {
        setLoadingSettings(true);
        const response = await get("campaigns/campaignSettings");
        if (response?.status === 200 && response?.data?.[0]) {
          setCampaignSettings(response.data[0]);

          if (!formData.budget) {
            const minBudget = getMinBudgetPerInfluencer(response.data[0]);
            setFormData((prev) => ({
              ...prev,
              budget: minBudget.toString(),
            }));
          }
        } else {
          setCampaignSettings({
            min_amount: 20,
            creation_fee: 5,
            creation_fee_type: "percentage",
          });
        }
      } catch (error) {
        console.error("Error fetching campaign settings:", error);
        toast.error("Failed to load campaign settings");
        setCampaignSettings({
          min_amount: 20,
          creation_fee: 5,
          creation_fee_type: "percentage",
        });
      } finally {
        setLoadingSettings(false);
      }
    };

    fetchCampaignSettings();
  }, []);

  const fetchBusinesses = useCallback(async () => {
    setLoadingBusinesses(true);

    try {
      const response = await get("agents/businesses");

      if (response?.status === 200 && response?.data) {
        const { businesses: businessList } = response.data;

        const activeBusinesses = (businessList || []).filter(
          (b) =>
            b.assignment_status === "active" &&
            b.verification_status === "approved"
        );

        setBusinesses(activeBusinesses);

        if (
          selectedBusiness &&
          !activeBusinesses.find(
            (b) => b.business_id === selectedBusiness.business_id
          )
        ) {
          toast.warning(
            "Pre-selected business is not active. Please select another."
          );
          setFormData((prev) => ({ ...prev, createdFor: "" }));
        }
      } else {
        throw new Error(response?.message || "Failed to fetch businesses");
      }
    } catch (err) {
      console.error("Failed to fetch businesses:", err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load businesses";
      toast.error(errorMessage);
      setBusinesses([]);
    } finally {
      setLoadingBusinesses(false);
    }
  }, [selectedBusiness]);

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  const handleDropdownToggle = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const closeAllDropdowns = () => {
    setOpenDropdown(null);
  };

  const selectedBusinessData = businesses.find(
    (b) => b.business_id === formData.createdFor
  );

  const budgetNumber = parseFloat(formData.budget) || 0;
  const numberOfInfluencers = 1;
  const minBudget = campaignSettings
    ? getMinBudgetPerInfluencer(campaignSettings)
    : 21;
  const managementFee = campaignSettings
    ? calculatePlatformFee(budgetNumber, campaignSettings)
    : budgetNumber * 0.05;
  const availableForInfluencers = budgetNumber - managementFee;

  const calculateDuration = () => {
    if (!formData.startDate || !formData.endDate) return "Not set";

    try {
      const start = createLocalDate(formData.startDate);
      const end = createLocalDate(formData.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} days`;
    } catch {
      return "Not set";
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const addTask = () => {
    setFormData((prev) => ({
      ...prev,
      tasks: [...prev.tasks, `Task ${prev.tasks.length + 1}`],
    }));
  };

  const updateTask = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task, i) => (i === index ? value : task)),
    }));
  };

  const removeTask = (index) => {
    if (formData.tasks.length > 1) {
      setFormData((prev) => ({
        ...prev,
        tasks: prev.tasks.filter((_, i) => i !== index),
      }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          image: file,
          imagePreview: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
      imagePreview: null,
    }));
  };

  // Helper function to convert dd/mm/yyyy to yyyy-mm-dd
  const convertDateFormat = (dateStr) => {
    if (!dateStr) return "";
    try {
      const [day, month, year] = dateStr.split("/");
      if (day && month && year) {
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      }
      return "";
    } catch (e) {
      return "";
    }
  };

  // Enhanced task management functions
  const handleAddTask = () => {
    if (
      !newTask.task.trim() ||
      !newTask.description.trim() ||
      !newTask.site_id ||
      !newTask.task_type ||
      (newTask.task_type === "repetitive" && !newTask.repeats_after)
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const taskToAdd = {
      task: newTask.task.trim(),
      description: newTask.description.trim(),
      site_id: parseInt(newTask.site_id),
      task_type: newTask.task_type,
      requires_url: newTask.requires_url ? "1" : "",
      repeats_after: newTask.repeats_after || "",
    };

    if (editingTaskIndex !== null) {
      setFormData((prev) => ({
        ...prev,
        tasks: prev.tasks.map((task, index) =>
          index === editingTaskIndex ? taskToAdd : task
        ),
      }));
      toast.success("Task updated successfully");
    } else {
      setFormData((prev) => ({
        ...prev,
        tasks: [...prev.tasks, taskToAdd],
      }));
      toast.success("Task added successfully");
    }

    setNewTask({
      task: "",
      description: "",
      requires_url: true,
      site_id: "",
      task_type: "",
      repeats_after: "",
    });
    setOpenTaskDialog(false);
    setEditingTaskIndex(null);
  };

  const handleEditTask = (index) => {
    const task = formData.tasks[index];
    setNewTask({
      task: task.task || "",
      description: task.description || "",
      site_id: task.site_id ? task.site_id.toString() : "",
      task_type: task.task_type || "",
      requires_url: task.requires_url === "1" || task.requires_url === true,
      repeats_after: task.repeats_after || "",
    });
    setEditingTaskIndex(index);
    setOpenTaskDialog(true);
  };

  const handleRemoveTask = (index) => {
    setFormData((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((_, i) => i !== index),
    }));
    toast.success("Task removed");
  };

  // Date validation
  const validateDates = () => {
    const { isValid, errors } = validateDateRange(formData.startDate, formData.endDate, 1);
    setDateErrors(errors);
    return isValid;
  };

  useEffect(() => {
    validateDates();
  }, [formData.startDate, formData.endDate]);

  const getMinStartDate = () => {
    return getMinimumDate(3);
  };

  const getMinEndDate = () => {
    if (!formData.startDate) return null;
    const startDate = createLocalDate(formData.startDate);
    if (!startDate) return null;
    const minEndDate = new Date(startDate);
    minEndDate.setDate(minEndDate.getDate() + 1);
    return minEndDate;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Campaign name is required";
    if (!formData.createdFor) newErrors.createdFor = "Please select a business";
    if (!formData.type) newErrors.type = "Campaign type is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.budget) newErrors.budget = "Budget is required";
    if (parseFloat(formData.budget) < minBudget) {
      newErrors.budget = `Minimum budget is $${minBudget}`;
    }
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (!formData.goals) newErrors.goals = "Campaign goal is required";
    
    // Validate tasks
    const validTasks = formData.tasks.filter(task => task.task && task.task.trim() !== "");
    if (validTasks.length === 0) {
      newErrors.tasks = "At least one task is required";
    }

    // Validate dates
    const dateValidation = validateDateRange(formData.startDate, formData.endDate, 1);
    if (!dateValidation.isValid) {
      Object.assign(newErrors, dateValidation.errors);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createDraftCampaign = async () => {
    try {
      setLoading(true);
      toast.loading("Creating draft campaign...", { id: "create-draft" });

      let campaignImageUrl = null;
      if (formData.image) {
        const imageFormData = new FormData();
        imageFormData.append("file_type", "STATUS_POST");
        imageFormData.append("content", formData.image);

        const uploadResponse = await upload("media/uploadFile", imageFormData);
        if (
          uploadResponse?.status === 200 &&
          uploadResponse?.data?.[0]?.file_url
        ) {
          campaignImageUrl = uploadResponse.data[0].file_url;
        }
      }

      // Convert dates from dd/mm/yyyy to yyyy-mm-dd format
      const startDate = convertDateFormat(formData.startDate);
      const endDate = convertDateFormat(formData.endDate);

      // Filter out empty tasks and format them properly
      const validTasks = formData.tasks
        .filter(task => task.task && task.task.trim() !== "")
        .map((task, index) => ({
          task: task.task.trim(),
          description: task.description.trim() || `${task.task.trim()} - Detailed description`,
          site_id: parseInt(task.site_id) || 4,
          task_type: task.task_type || "repetitive",
          requires_url: task.requires_url ? "1" : "",
          repeats_after: task.repeats_after || "daily",
        }));

      const draftPayload = {
        title: formData.name.trim(),
        description: formData.description.trim(),
        objective: formData.goals,
        start_date: startDate,
        end_date: endDate,
        budget: parseFloat(formData.budget),
        number_of_influencers: numberOfInfluencers,
        business_id: formData.createdFor,
        ...(campaignImageUrl && { campaign_image: campaignImageUrl }),
        tasks: validTasks,
      };

      console.log("Draft Payload:", JSON.stringify(draftPayload, null, 2));

      const draftResponse = await post("campaigns/create-draft", draftPayload);

      if (draftResponse?.status === 200 && draftResponse?.data?.campaign_id) {
        const campaignId = draftResponse.data.campaign_id;
        setDraftCampaignId(campaignId);

        toast.success("Draft campaign created successfully", {
          id: "create-draft",
        });
        return { success: true, campaignId };
      } else {
        throw new Error(
          draftResponse?.message || "Failed to create draft campaign"
        );
      }
    } catch (error) {
      console.error("Error creating draft campaign:", error);
      toast.error(error.message || "Failed to create draft campaign", {
        id: "create-draft",
      });
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const result = await createDraftCampaign();
    if (result.success) {
      setCurrentStep("influencers");
    }
  };

  const handleSaveAsDraft = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields before saving");
      return;
    }
    
    const result = await createDraftCampaign();
    if (result.success) {
      toast.success("Campaign saved as draft");
      onSaveAsDraft?.(formData);
    }
  };

  const handleInfluencerConfirm = (influencerData) => {
    setSelectedInfluencersData(influencerData);
    setCurrentStep("approval");
  };

  const handleFinalApproval = () => {
    const finalCampaignData = {
      ...formData,
      selectedBusiness: selectedBusinessData,
      influencers: selectedInfluencersData,
      campaign_id: draftCampaignId,
    };
    onCreateCampaign?.(finalCampaignData);
  };

  if (loadingBusinesses || loadingSettings) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <SkeletonCard />
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="h-4 bg-gray-200 rounded w-32 mb-3 animate-pulse"></div>
                  <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="h-4 bg-gray-200 rounded w-32 mb-3 animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === "influencers") {
    return (
      <InfluencerSelection
        campaign={{
          ...formData,
          selectedBusiness: selectedBusinessData,
          campaign_id: draftCampaignId,
        }}
        onBack={() => setCurrentStep("form")}
        onConfirm={handleInfluencerConfirm}
      />
    );
  }

  if (currentStep === "approval") {
    return (
      <CampaignApproval
        campaign={{
          ...formData,
          selectedBusiness: selectedBusinessData,
          campaign_id: draftCampaignId,
        }}
        selectedInfluencersData={selectedInfluencersData}
        onBack={() => setCurrentStep("influencers")}
        onApprove={handleFinalApproval}
      />
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen" onClick={closeAllDropdowns}>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center hover:bg-yellow-500 transition-colors"
              disabled={loading}
            >
              <ArrowLeft className="h-5 w-5 text-gray-900" />
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                Create New Campaign
              </h1>
              <p className="text-xs text-gray-600">
                {selectedBusinessData
                  ? `Creating campaign for ${selectedBusinessData.business_name}`
                  : "Fill in the campaign details to get started"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div
                className="bg-white rounded-lg border border-gray-200 p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-6">
                  <h2 className="text-sm font-semibold text-gray-900 mb-1">
                    Campaign Details
                  </h2>
                  <p className="text-xs text-gray-600">
                    Fill in the information for your new campaign
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-900">
                        Campaign Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        placeholder="Enter campaign name"
                        disabled={loading}
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-xs placeholder:text-gray-500 hover:border-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 focus:outline-none transition-all disabled:opacity-50"
                      />
                      {errors.name && (
                        <p className="text-xs text-red-600">{errors.name}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-900">
                        Created For <span className="text-red-500">*</span>
                      </label>
                      {loadingBusinesses ? (
                        <div className="flex h-10 w-full items-center justify-center rounded-md border border-gray-300 bg-gray-100">
                          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                        </div>
                      ) : businesses.length === 0 ? (
                        <div className="flex flex-col gap-2">
                          <div className="flex h-10 w-full items-center justify-center rounded-md border border-gray-300 bg-gray-50 text-xs text-gray-500">
                            No active businesses found
                          </div>
                          <button
                            onClick={fetchBusinesses}
                            className="flex items-center justify-center gap-1 text-xs text-blue-600 hover:text-blue-700"
                          >
                            <RefreshCw className="h-3 w-3" />
                            Retry
                          </button>
                        </div>
                      ) : (
                        <ProfessionalDropdown
                          value={
                            selectedBusinessData
                              ? `${selectedBusinessData.business_name}`
                              : ""
                          }
                          placeholder="Select business"
                          options={businesses}
                          onSelect={(business) => {
                            handleInputChange(
                              "createdFor",
                              business.business_id
                            );
                            closeAllDropdowns();
                          }}
                          isOpen={openDropdown === "business"}
                          onToggle={() => handleDropdownToggle("business")}
                          renderOption={(business) => (
                            <div className="flex items-center justify-between w-full">
                              <div>
                                <div className="font-medium text-xs">
                                  {business.business_name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {business.verification_status === "approved"
                                    ? "Verified"
                                    : "Pending"}
                                </div>
                              </div>
                              {business.assignment_status === "active" && (
                                <Badge className="text-[10px] bg-green-100 text-green-700">
                                  Active
                                </Badge>
                              )}
                            </div>
                          )}
                        />
                      )}
                      {errors.createdFor && (
                        <p className="text-xs text-red-600">
                          {errors.createdFor}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-900">
                      Campaign Type <span className="text-red-500">*</span>
                    </label>
                    <ProfessionalDropdown
                      value={formData.type}
                      placeholder="Select type"
                      options={campaignTypes}
                      onSelect={(type) => {
                        handleInputChange("type", type);
                        closeAllDropdowns();
                      }}
                      isOpen={openDropdown === "type"}
                      onToggle={() => handleDropdownToggle("type")}
                    />
                    {errors.type && (
                      <p className="text-xs text-red-600">{errors.type}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-900">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      placeholder="Describe your campaign objectives and key messages..."
                      rows={3}
                      disabled={loading}
                      className="flex w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-xs placeholder:text-gray-500 hover:border-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 focus:outline-none transition-all resize-none disabled:opacity-50"
                    />
                    {errors.description && (
                      <p className="text-xs text-red-600">{errors.description}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-900">
                      Campaign Image
                    </label>
                    {formData.imagePreview ? (
                      <div className="relative">
                        <img
                          src={formData.imagePreview}
                          alt="Campaign preview"
                          className="w-full h-48 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          onClick={removeImage}
                          disabled={loading}
                          className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors disabled:opacity-50"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                          disabled={loading}
                        />
                        <label
                          htmlFor="image-upload"
                          className={`inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors ${
                            loading ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          <Upload className="h-4 w-4" />
                          Upload Image
                        </label>
                        <p className="text-xs text-gray-500 mt-2">
                          JPG, PNG up to 10MB
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-900">
                        Total Budget ($) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={formData.budget}
                        onChange={(e) =>
                          handleInputChange("budget", e.target.value)
                        }
                        placeholder={minBudget.toString()}
                        disabled={loading}
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-xs placeholder:text-gray-500 hover:border-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 focus:outline-none transition-all disabled:opacity-50"
                      />
                      <p className="text-xs text-gray-500">
                        Minimum budget: ${minBudget} | Platform fee: $
                        {managementFee.toFixed(2)}
                      </p>
                      {errors.budget && (
                        <p className="text-xs text-red-600">{errors.budget}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-900">
                        Target Audience
                      </label>
                      <input
                        type="text"
                        value={formData.targetAudience}
                        onChange={(e) =>
                          handleInputChange("targetAudience", e.target.value)
                        }
                        placeholder="e.g., Young professionals 25-35"
                        disabled={loading}
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-xs placeholder:text-gray-500 hover:border-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 focus:outline-none transition-all disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-900">
                        Start Date <span className="text-red-500">*</span>
                      </label>
                      <DatePicker
                        value={formData.startDate}
                        onChange={(value) =>
                          handleInputChange("startDate", value)
                        }
                        placeholder="dd/mm/yyyy"
                        minDate={getMinStartDate()}
                        error={dateErrors.startDate || errors.startDate}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-900">
                        End Date <span className="text-red-500">*</span>
                      </label>
                      <DatePicker
                        value={formData.endDate}
                        onChange={(value) =>
                          handleInputChange("endDate", value)
                        }
                        placeholder="dd/mm/yyyy"
                        minDate={getMinEndDate()}
                        error={dateErrors.endDate || errors.endDate}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-900">
                      Campaign Goals <span className="text-red-500">*</span>
                    </label>
                    <ProfessionalDropdown
                      value={formData.goals}
                      placeholder="Select primary goal"
                      options={campaignGoals}
                      onSelect={(goal) => {
                        handleInputChange("goals", goal);
                        closeAllDropdowns();
                      }}
                      isOpen={openDropdown === "goals"}
                      onToggle={() => handleDropdownToggle("goals")}
                    />
                    {errors.goals && (
                      <p className="text-xs text-red-600">{errors.goals}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-gray-900">
                        Campaign Tasks <span className="text-red-500">*</span>
                      </label>
                      <button
                        onClick={() => {
                          setEditingTaskIndex(null);
                          setNewTask({
                            task: "",
                            description: "",
                            requires_url: true,
                            site_id: "",
                            task_type: "",
                            repeats_after: "",
                          });
                          setOpenTaskDialog(true);
                        }}
                        className="flex items-center gap-2 px-3 py-2 bg-yellow-400 text-black rounded-md text-xs font-medium hover:bg-yellow-500 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                        Add Task
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      {formData.tasks.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                          <p className="text-xs">No tasks added yet</p>
                          <p className="text-xs text-gray-400 mt-1">Add tasks to guide creators</p>
                        </div>
                      ) : (
                        formData.tasks.map((task, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex-1">
                              <div className="font-medium text-xs text-gray-900">{task.task}</div>
                              <div className="text-xs text-gray-600 mt-1">{task.description}</div>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs text-gray-500">Platform: {socialSites.find(s => s.site_id === task.site_id)?.sm_name || 'Unknown'}</span>
                                <span className="text-xs text-gray-500">Type: {task.task_type}</span>
                                {task.task_type === 'repetitive' && (
                                  <span className="text-xs text-gray-500">Repeats: {task.repeats_after}</span>
                                )}
                                <span className="text-xs text-gray-500">URL: {task.requires_url ? 'Required' : 'Not required'}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEditTask(index)}
                                className="p-1 hover:bg-gray-200 rounded transition-colors"
                              >
                                <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleRemoveTask(index)}
                                className="p-1 hover:bg-gray-200 rounded transition-colors"
                              >
                                <X className="h-4 w-4 text-gray-500" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    {errors.tasks && (
                      <p className="text-xs text-red-600">{errors.tasks}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                  <div></div>
                  <div className="flex w-full items-center gap-3">
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      style={{ backgroundColor: "rgb(249, 215, 105)" }}
                      className="px-6 py-2 rounded-md text-xs font-medium text-gray-900 hover:opacity-90 transition-opacity w-full disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create Campaign"
                      )}
                    </button>
                    <button
                      onClick={handleSaveAsDraft}
                      disabled={loading}
                      className="px-4 py-2 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors min-w-fit disabled:opacity-50"
                    >
                      Save as Draft
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {selectedBusinessData && (
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h3 className="text-xs font-semibold text-gray-900 mb-3">
                    Selected Business
                  </h3>
                  <div className="flex items-center gap-2">
                    <div>
                      <h4 className="text-xs font-semibold text-gray-900">
                        {selectedBusinessData.business_name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {selectedBusinessData.verification_status === "approved"
                          ? "Verified Business"
                          : "Pending Verification"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-xs font-semibold text-gray-900 mb-3">
                  Campaign Summary
                </h3>

                {formData.imagePreview && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-600 mb-2">
                      Campaign Image:
                    </p>
                    <img
                      src={formData.imagePreview}
                      alt="Campaign preview"
                      className="w-full h-32 object-cover rounded-md border border-gray-200"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <Target className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600">Type:</span>
                    <span className="text-gray-900">
                      {formData.type || "Not selected"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <DollarSign className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600">Budget:</span>
                    <span className="text-gray-900">
                      ${formData.budget || "0"}
                    </span>
                  </div>

                  {budgetNumber > 0 && (
                    <div className="text-xs text-gray-500 ml-5">
                      <div>
                        Available for influencers: $
                        {availableForInfluencers.toLocaleString()}
                      </div>
                      <div>
                        Platform Fee ({campaignSettings?.creation_fee}
                        {campaignSettings?.creation_fee_type === "percentage"
                          ? "%"
                          : ""}
                        ): ${managementFee.toLocaleString()}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600">Duration:</span>
                    <span className="text-gray-900">{calculateDuration()}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <Users className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600">Audience:</span>
                    <span className="text-gray-900">
                      {formData.targetAudience || "Not defined"}
                    </span>
                  </div>

                  {formData.tasks.length > 0 && (
                    <div className="text-xs">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-600">
                          Tasks ({formData.tasks.length}):
                        </span>
                      </div>
                      <div className="ml-5 text-xs text-gray-600">
                        <div>{formData.tasks[0]?.task}</div>
                        {formData.tasks.length > 1 && (
                          <div>+{formData.tasks.length - 1} more tasks</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-xs font-semibold text-gray-900 mb-3">
                  Quick Tips
                </h3>
                <div className="space-y-1 text-xs text-gray-600">
                  <div>✓ Choose clear, measurable campaign goals</div>
                  <div>✓ Upload a compelling campaign image</div>
                  <div>✓ Break down work into specific tasks</div>
                  <div>✓ Minimum budget: ${minBudget} per influencer</div>
                  {campaignSettings && (
                    <div>
                      ✓ Platform fee: {campaignSettings.creation_fee}
                      {campaignSettings.creation_fee_type === "percentage"
                        ? "%"
                        : " USD"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task Dialog */}
      <TaskDialog
        isOpen={openTaskDialog}
        onClose={() => {
          setOpenTaskDialog(false);
          setEditingTaskIndex(null);
          setNewTask({
            task: "",
            description: "",
            requires_url: true,
            site_id: "",
            task_type: "",
            repeats_after: "",
          });
        }}
        newTask={newTask}
        setNewTask={setNewTask}
        onAddTask={handleAddTask}
        editingTaskIndex={editingTaskIndex}
        socialSites={socialSites}
      />
    </div>
  );
}