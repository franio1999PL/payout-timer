import React, { useEffect, useState } from 'react';

function App() {
  const calculateTargetDate = () => {
    const now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;

    if (month === 12) {
      year++;
      month = 0;
    }

    let targetDate = new Date(year, month, 10);

    // Sprawdzenie, czy 10 dzień miesiąca wypada w weekend lub poniedziałek
    const dayOfWeek = targetDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 1) {
      // Niedziela (0) lub Poniedziałek (1)
      targetDate.setDate(targetDate.getDate() - (dayOfWeek + 2));
    } else if (dayOfWeek === 6) {
      // Sobota (6)
      targetDate.setDate(targetDate.getDate() - 1);
    }

    return targetDate;
  };

  const calculateTimeLeft = () => {
    const now = new Date();
    const targetDate = calculateTargetDate();
    const difference = targetDate - now;

    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        dni: Math.floor(difference / (1000 * 60 * 60 * 24)),
        godziny: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minuty: Math.floor((difference / 1000 / 60) % 60),
        sekundy: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [balance, setBalance] = useState(0);
  const [dailyAllowance, setDailyAllowance] = useState(0);
  const [targetDate, setTargetDate] = useState(calculateTargetDate());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  useEffect(() => {
    setTargetDate(calculateTargetDate());
  }, []);

  useEffect(() => {
    if (timeLeft.dni !== undefined) {
      setDailyAllowance((balance / timeLeft.dni).toFixed(2));
    }
  }, [balance, timeLeft]);

  const handleBalanceChange = (event) => {
    const value = parseFloat(event.target.value);
    if (value >= 0) {
      setBalance(value);
    } else {
      setBalance(0); // Domyślna wartość w przypadku wartości ujemnej
    }
  };

  const getDayName = (date) => {
    const days = [
      'Niedziela',
      'Poniedziałek',
      'Wtorek',
      'Środa',
      'Czwartek',
      'Piątek',
      'Sobota',
    ];
    return days[date.getDay()];
  };

  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval]) {
      return;
    }

    timerComponents.push(
      <span className="text-white" key={interval}>
        {timeLeft[interval]} {interval}{' '}
      </span>,
    );
  });

  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-[#333]">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl text-center font-bold uppercase text-slate-50">
          Odliczanie do 10 dnia przyszłego miesiąca
        </h1>
        <div className="text-2xl text-center">
          {timerComponents.length ? timerComponents : <span>Minęło już!</span>}
        </div>
        <div className="text-2xl text-center text-white">
          {`Szacowany dzień wypłaty: ${getDayName(
            targetDate,
          )} (${targetDate.toLocaleDateString()})`}
        </div>
        <div className="flex flex-col items-center justify-center">
          <input
            className="p-2 text-black rounded-xl w-80 text-center bg-white"
            type="number"
            min="0"
            placeholder="Wprowadź stan konta w PLN"
            value={balance}
            onChange={handleBalanceChange}
          />
          <p className="p-4 text-2xl font-bold text-white text-center">
            Możesz wydać dziennie: {dailyAllowance} PLN
          </p>
        </div>
      </div>
    </section>
  );
}

export default App;
