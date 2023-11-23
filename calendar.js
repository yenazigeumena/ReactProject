import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getMonth } from 'date-fns';

function Calendar() {
  const currentDate = new Date();
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const [memos, setMemos] = useState({});
  const [alarms, setAlarms] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [inputMemo, setInputMemo] = useState('');
  const [inputAlarm, setInputAlarm] = useState('');

  const addMemo = () => {
    if (selectedDate) {
      setMemos((prevMemos) => ({
        ...prevMemos,
        [format(selectedDate, 'yyyy-MM-dd')]: inputMemo,
      }));
      setAlarms((prevAlarms) => ({
        ...prevAlarms,
        [format(selectedDate, 'yyyy-MM-dd')]: inputAlarm,
      }));
      setSelectedDate(null);
      setInputMemo('');
      setInputAlarm('');
    }
  };

  const deleteMemo = () => {
    if (selectedDate) {
      const { [format(selectedDate, 'yyyy-MM-dd')]: deletedMemo, ...restMemos } = memos;
      const { [format(selectedDate, 'yyyy-MM-dd')]: deletedAlarm, ...restAlarms } = alarms;
      setMemos(restMemos);
      setAlarms(restAlarms);
      setSelectedDate(null);
      setInputMemo('');
      setInputAlarm('');
    }
  };

  const showNotification = () => {
    if (selectedDate && alarms[format(selectedDate, 'yyyy-MM-dd')]) {
      const notification = new Notification(`일정 알림: ${format(selectedDate, 'yyyy-MM-dd')}`, {
        body: `일정 시간입니다: ${alarms[format(selectedDate, 'yyyy-MM-dd')]}`,
      });
      notification.onclick = () => {
        // 클릭 시 알림창이 사라집니다.
        window.focus();
      };
    }
  };

  useEffect(() => {
    // 페이지 로드 시 알람 퍼미션 요청
    Notification.requestPermission();
  }, []);

  return (
    <div>
      <h2>{format(currentDate, 'MMMM yyyy')}</h2>
      <table>
        <tbody>
          {daysInMonth.map((day) => (
            <td key={day}>
              {getMonth(day) === getMonth(currentDate) && (
                <>
                  <div
                    onClick={() => {
                      setSelectedDate(day);
                      setInputMemo(memos[format(day, 'yyyy-MM-dd')] || '');
                      setInputAlarm(alarms[format(day, 'yyyy-MM-dd')] || '');
                    }}
                    style={{ cursor: 'pointer', textDecoration: selectedDate === day ? 'underline' : 'none' }}
                  >
                    {format(day, 'd')}
                  </div>
                  <textarea
                    value={memos[format(day, 'yyyy-MM-dd')] || ''}
                    onChange={(e) => setInputMemo(e.target.value)}
                  />
                  <input
                    type="time"
                    value={alarms[format(day, 'yyyy-MM-dd')] || ''}
                    onChange={(e) => setInputAlarm(e.target.value)}
                  />
                  <button onClick={addMemo}>Add/Update Memo</button>
                  <button onClick={deleteMemo}>Delete Memo</button>
                  <button onClick={showNotification}>Set Alarm</button>
                </>
              )}
            </td>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Calendar;
