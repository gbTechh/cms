import React, { useState, useEffect, useRef } from 'react';
import { format, parse, isValid, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, getDay, isSameDay, addYears, subYears } from 'date-fns';
import { Input, Label, Text } from '../atoms';
import styles from './datepicker.module.css';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from 'react-icons/md';
import { IoCalendarClear } from 'react-icons/io5';
import { IoIosClose } from 'react-icons/io';

// Tipos para las props del componente
interface DatePickerProps {
  label: string;
  name: string;
  value: string | undefined;
  onChange: (value: any) => void;
  required?: boolean;
  formatType?: 'date' | 'datetime'; // De tu interfaz DateField
}

export const DatePicker: React.FC<DatePickerProps> = ({ label, name, value, onChange, required, formatType = 'date' }) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? parse(value, 'yyyy-MM-dd', new Date()) : null
  );
  const [currentDate, setCurrentDate] = useState<Date>(
    selectedDate || new Date()
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Sincronizar el valor externo con el estado interno
  useEffect(() => {
    if (value) {
      const parsedDate = parse(value, 'yyyy-MM-dd', new Date());
      if (isValid(parsedDate)) {
        setSelectedDate(parsedDate);
        setCurrentDate(parsedDate);
      }
    } else {
      setSelectedDate(null);
    }
  }, [value]);

  const handleCliclClean = () => {
    setSelectedDate(null)
  }
  // Cerrar el calendario si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node) && inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Ajustar la posición del calendario dinámicamente
  useEffect(() => {
    if (isCalendarOpen && inputRef.current && calendarRef.current) {
      const inputRect = inputRef.current.getBoundingClientRect();
      const calendarHeight = calendarRef.current.offsetHeight || 300; // Estimación de altura si no se calcula
      const spaceBelow = window.innerHeight - inputRect.bottom;
      const shouldOpenUpward = spaceBelow < calendarHeight;

      if (shouldOpenUpward) {
        calendarRef.current.style.top = `-${calendarHeight - 10}px`;
      } else {
        calendarRef.current.style.top = '100p%';
      }
    }
  }, [isCalendarOpen]);

  // Manejar cambios en el input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const parsedDate = parse(inputValue, 'yyyy-MM-dd', new Date());
    if (isValid(parsedDate)) {
      setSelectedDate(parsedDate);
      setCurrentDate(parsedDate);
      onChange({name, value: format(parsedDate, 'yyyy-MM-dd')});
    } else {
      setSelectedDate(null);
      onChange({name, value: ''});
    }
  };

  // Manejar la selección de una fecha en el calendario
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setCurrentDate(date);
    setIsCalendarOpen(false);
    onChange({name, value: format(date, 'yyyy-MM-dd')});
  };

  // Navegar entre meses
  const handlePrevMonth = () => setCurrentDate(addMonths(currentDate, -1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  // Navegar entre años
  const handlePrevYear = () => setCurrentDate(subYears(currentDate, 1));
  const handleNextYear = () => setCurrentDate(addYears(currentDate, 1));

  // Generar los días del mes
  const start = startOfMonth(currentDate);
  const end = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start, end });
  const firstDayOfMonth = getDay(start); // 0 (Domingo) a 6 (Sábado)

  // Añadir días vacíos al inicio para alinear el calendario
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  return (
    <div className={styles.container}>
      <Label required={required} label={label} />
      {/* Input para mostrar la fecha */}
      <div className={styles.wrap}>
        <Input
          ref={inputRef}
          className={styles.inputDiv}
          inputClassName={styles.input}
          type={formatType === 'datetime' ? 'datetime-local' : 'date'}
          name={name}
          value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
          onChange={handleInputChange}
          onFocus={() => setIsCalendarOpen(true)}
          required={required}
        />
       
        {
          selectedDate !== null ? (<button
            type="button"
            className={styles.btnCloseCalendar}
            onClick={handleCliclClean}
            style={{ padding: '8px' }}
          >
            <IoIosClose />
          </button>) : <></>
        }
         {/* Botón para abrir el calendario */}
        <button
          type="button"
          className={styles.btnOpenCalendar}
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          style={{ padding: '8px' }}
        >
          <IoCalendarClear />
        </button>
      </div>

      {/* Calendario emergente */}
      {isCalendarOpen && (
        <div
          ref={calendarRef}
          className={styles.dropdown}
          style={{
            position: 'absolute',
            left: 0,
            top: '100%', // Valor por defecto, se ajustará dinámicamente
          }}
        >
          {/* Navegación del mes y año */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <button type="button" className={styles.button} onClick={handlePrevYear}>
              <MdKeyboardDoubleArrowLeft />
            </button>
            <button type="button" className={styles.button} onClick={handlePrevMonth}>
              <MdKeyboardArrowLeft />
            </button>
            <Text as='span' style={{ alignSelf: 'center' }}>{format(currentDate, 'MMMM yyyy')}</Text>
            <button type="button" className={styles.button} onClick={handleNextMonth}>
              <MdKeyboardArrowRight />
            </button>
            <button type="button" className={styles.button} onClick={handleNextYear}>
              <MdKeyboardDoubleArrowRight />
            </button>
          </div>

          {/* Días de la semana */}
          <div
            style={{
              display: 'grid',
              padding: '10px 0',
              gridTemplateColumns: 'repeat(7, 40px)',
              textAlign: 'center',
              fontWeight: 'bold',
              marginBottom: '10px',
              background: '#353535',
            }}
          >
            {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'].map((day) => (
              <Text size='sm' key={day}>{day}</Text>
            ))}
          </div>

          {/* Días del mes */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px' }}>
            {emptyDays.map((_, index) => (
              <div key={`empty-${index}`} style={{ padding: '5px', aspectRatio: '1/1' }} />
            ))}
            {days.map((day) => (
              <button
                key={day.toISOString()}
                type="button"
                onClick={() => handleDateSelect(day)}
                className={styles.btnDate}
                style={{
                  background: isSameDay(day, selectedDate || new Date())
                    ? '#101010'
                    : isSameDay(day, new Date())
                    ? '#353535'
                    : 'transparent',
                  color: isSameDay(day, selectedDate || new Date()) ? '#fff' : '#000',
                }}
              >
                <Text size='sm'>
                  {format(day, 'd')}
                </Text>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};