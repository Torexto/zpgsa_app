import {DateTime} from 'luxon';
import {StopInfo, StopInfoBus} from "./types";

type Date = {
    day: number;
    month: number;
};

const daysFreeFromSchool: Date[] = [
    {day: 1, month: 1}, {day: 6, month: 1}, {day: 23, month: 12}, {day: 24, month: 12},
    {day: 25, month: 12}, {day: 26, month: 12}, {day: 27, month: 12}, {day: 30, month: 12},
    {day: 31, month: 12}, {day: 2, month: 1}, {day: 3, month: 1}, {day: 3, month: 2},
    {day: 4, month: 2}, {day: 5, month: 2}, {day: 6, month: 2}, {day: 7, month: 2},
    {day: 10, month: 2}, {day: 11, month: 2}, {day: 12, month: 2}, {day: 13, month: 2},
    {day: 14, month: 2}
];

const holidays: Date[] = [{day: 6, month: 1}];

const filterBuses = (date: DateTime, buses: StopInfoBus[]): StopInfoBus[] => {
    const now = {day: date.day, month: date.month};
    const isHoliday = holidays.some(d => d.day === now.day && d.month === now.month);

    return buses.filter(bus => {
        if (isHoliday) return bus.operating_days === 'sun';

        switch (date.weekday) {
            case 7:
                return bus.operating_days === 'sun';
            case 6:
                return bus.operating_days === 'sat';
            default: {
                const isSchoolDay = !daysFreeFromSchool.some(d => d.day === now.day && d.month === now.month);
                return bus.operating_days === 'mon_fri' &&
                    (bus.school_restriction === 'free_day_only' ? !isSchoolDay : bus.school_restriction === 'school_only' ? isSchoolDay : true);
            }
        }
    });
};

const parseBusTime = (busTime: string, now: DateTime): DateTime | null => {
    const parsedTime = DateTime.fromFormat(busTime, 'HH:mm');
    return parsedTime.isValid ? parsedTime.set({year: now.year, month: now.month, day: now.day}) : null;
};

export const getStopDetails = (id: string, stopDetailsState: Record<string, StopInfo>): StopInfo | null => {
    const nowDate = DateTime.now();

    const stop = stopDetailsState[id];
    if (!stop) return null;

    let filteredBuses = filterBuses(nowDate, stop.buses);
    filteredBuses = filteredBuses.filter(bus => {
        const busTime = parseBusTime(bus.time, nowDate);
        return busTime ? busTime >= nowDate : false;
    }).sort((a, b) => DateTime.fromFormat(a.time, 'HH:mm').toMillis() - DateTime.fromFormat(b.time, 'HH:mm').toMillis());

    if (filteredBuses.length < 15) {
        const extended = (filterBuses(nowDate.plus({days: 1}), stop.buses)).sort((a, b) => {
            const timeA = DateTime.fromFormat(a.time.trim(), 'HH:mm');
            const timeB = DateTime.fromFormat(b.time.trim(), 'HH:mm');
            return timeA.toMillis() - timeB.toMillis();
        })
        filteredBuses = [...filteredBuses, ...extended];
    }

    return {id, buses: filteredBuses.slice(0, 15)};
};