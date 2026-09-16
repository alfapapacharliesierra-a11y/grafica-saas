'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import dayjs from 'dayjs';
import ptBR from 'dayjs/locale/pt-br';

dayjs.locale(ptBR);

type ViewType = 'month' | 'week' | 'day';

export default function AgendaPage() {
  const [viewType, setViewType] = useState<ViewType>('month');
  const [currentDate, setCurrentDate] = useState(dayjs());

  const handlePrevious = () => {
    if (viewType === 'month') {
      setCurrentDate(currentDate.subtract(1, 'month'));
    } else if (viewType === 'week') {
      setCurrentDate(currentDate.subtract(1, 'week'));
    } else {
      setCurrentDate(currentDate.subtract(1, 'day'));
    }
  };

  const handleNext = () => {
    if (viewType === 'month') {
      setCurrentDate(currentDate.add(1, 'month'));
    } else if (viewType === 'week') {
      setCurrentDate(currentDate.add(1, 'week'));
    } else {
      setCurrentDate(currentDate.add(1, 'day'));
    }
  };

  const handleToday = () => {
    setCurrentDate(dayjs());
  };

  // Generate calendar days for month view
  const getDaysInMonth = () => {
    const startOfMonth = currentDate.startOf('month');
    const endOfMonth = currentDate.endOf('month');
    const startOfWeek = startOfMonth.startOf('week');
    const endOfWeek = endOfMonth.endOf('week');

    const days = [];
    let day = startOfWeek;

    while (day.isBefore(endOfWeek) || day.isSame(endOfWeek)) {
      days.push(day);
      day = day.add(1, 'day');
    }

    return days;
  };

  const days = getDaysInMonth();
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <Layout>
      <div className="p-4 md:p-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agenda</h1>
          <p className="text-gray-600 mt-1">Visualize os prazos dos serviços</p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-lg shadow p-4">
          <div className="flex gap-2">
            <button
              onClick={() => setViewType('day')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewType === 'day'
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Dia
            </button>
            <button
              onClick={() => setViewType('week')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewType === 'week'
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Semana
            </button>
            <button
              onClick={() => setViewType('month')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewType === 'month'
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Mês
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handlePrevious}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-lg font-semibold text-gray-900 min-w-[200px] text-center">
              {currentDate.format('MMMM YYYY')}
            </span>
            <button
              onClick={handleNext}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
            <button
              onClick={handleToday}
              className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              Hoje
            </button>
          </div>
        </div>

        {/* Calendar */}
        {viewType === 'month' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 bg-blue-50 border-b border-gray-200">
              {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'].map((day) => (
                <div key={day} className="p-4 text-center font-semibold text-gray-900 text-sm">
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="divide-y divide-gray-200">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="grid grid-cols-7 divide-x divide-gray-200">
                  {week.map((day) => {
                    const isCurrentMonth = day.isSame(currentDate, 'month');
                    const isToday = day.isSame(dayjs(), 'day');

                    return (
                      <div
                        key={day.format('YYYY-MM-DD')}
                        className={`min-h-[120px] p-3 ${
                          isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                        } ${isToday ? 'bg-blue-50' : ''}`}
                      >
                        <p
                          className={`text-sm font-medium mb-2 ${
                            isToday
                              ? 'text-blue-600 bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center'
                              : 'text-gray-900'
                          }`}
                        >
                          {day.format('D')}
                        </p>
                        <div className="space-y-1 text-xs text-gray-500">
                          <p>Nenhum serviço</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Placeholder for Week/Day View */}
        {(viewType === 'week' || viewType === 'day') && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 text-lg">Visualização em desenvolvimento</p>
            <p className="text-gray-400 text-sm mt-2">Use a visualização por mês por enquanto</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
