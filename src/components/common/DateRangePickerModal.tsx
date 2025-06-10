import React, { useState } from "react";
import Modal from "./Modal"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "./Button";
import { CalendarDays, X } from "lucide-react";

interface DateRangePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (startDate: Date | null, endDate: Date | null) => void;
  initialStartDate?: Date | null;
  initialEndDate?: Date | null;
}

const DateRangePickerModal: React.FC<DateRangePickerModalProps> = ({
  isOpen,
  onClose,
  onApply,
  initialStartDate = null,
  initialEndDate = null,
}) => {
  const [startDate, setStartDate] = useState<Date | null>(initialStartDate);
  const [endDate, setEndDate] = useState<Date | null>(initialEndDate);

  const handleApply = () => {
    onApply(startDate, endDate);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      modalTitle="Select period"
      titleIcon={<CalendarDays size={20} />}
    >
      <div className="p-2 sm:p-1">
        {" "}
        <DatePicker
          selected={startDate}
          onChange={(dates) => {
            const [start, end] = dates as [Date | null, Date | null]; 
            setStartDate(start);
            setEndDate(end);
          }}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          inline // To make the calendar appear directly in the modal
          monthsShown={2} // Show two months side by side
          calendarClassName="custom-datepicker"
          dayClassName={(date) => "hover:bg-primary-light rounded-full"}
          todayButton="Today"
          
        />
      </div>
      <div className="flex justify-between space-x-3 pt-4 p-4 border-t border-gray-200">
        <Button variant="outline" onClick={onClose} className="flex items-center w-full mx-2">
          Cancel
        </Button>
        <Button variant="primary" onClick={handleApply} className="flex items-center w-full mx-2">
          OK
        </Button>
      </div>
    </Modal>
  );
};

export default DateRangePickerModal;
