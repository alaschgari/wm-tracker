import { Match } from '../types';

export const exportToIcs = (
  match: Match,
  homeName: string,
  awayName: string,
  stageDisplay: string
) => {
  const startDate = new Date(match.date);
  const endDate = new Date(startDate.getTime() + 120 * 60 * 1000); // 2 Stunden Dauer standardmäßig

  const formatUTC = (d: Date) => {
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const dtStamp = formatUTC(new Date());
  const dtStart = formatUTC(startDate);
  const dtEnd = formatUTC(endDate);

  const summary = `WM 2026: ${homeName} vs. ${awayName}`;
  const description = `${stageDisplay} - FIFA World Cup 2026\\nStadion: ${match.stadium || 'Stadion'}\\nGastgeberstadt: ${match.city || 'Gastgeberstadt'}`;
  const location = `${match.stadium || 'Stadion'}, ${match.city || 'Gastgeberstadt'}`;

  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//WM 2026 Tracker//NONSGML v1.0//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:match-${match.id}-${startDate.getTime()}@wm-tracker`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ];

  const icsString = icsLines.join('\r\n');
  const blob = new Blob([icsString], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `WM_2026_Match_${match.id}_${homeName.replace(/\s+/g, '_')}_${awayName.replace(/\s+/g, '_')}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
