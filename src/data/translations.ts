export type Language = 'de' | 'en' | 'es' | 'fr' | 'ru' | 'uk';

export interface TranslationDictionary {
  title: string;
  subtitle: string;
  groupStage: string;
  knockoutStage: string;
  simulateAll: string;
  reset: string;
  liveSync: string;
  liveSyncing: string;
  groupMatches: string;
  liveStandings: string;
  matchTree: string;
  round32: string;
  round16: string;
  quarterFinals: string;
  semiFinals: string;
  thirdPlace: string;
  final: string;
  allGroups: string;
  group: string;
  liveSyncSuccess: string;
  liveSyncError: string;
  resetConfirm: string;
  saved: string;
  finalize: string;
  allRounds: string;
  loading: string;
  penalty: string;
  timeMatrix: string;
  topScorers: string;
  selectTimezone: string;
  favoriteTooltip: string;
  teamLabel: string;
  playedLabel: string;
  diffLabel: string;
  pointsLabel: string;
}


export const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  de: {
    title: 'FIFA World Cup 2026',
    subtitle: 'Ergebnis-Tracker & interaktiver Turniersimulator. Trage Tore ein oder simuliere das gesamte Turnier.',
    groupStage: 'Gruppenphase',
    knockoutStage: 'K.o.-Phase',
    simulateAll: '⚡ Alle simulieren',
    reset: '↺ Zurücksetzen',
    liveSync: '🔄 Live-Sync',
    liveSyncing: '⌛ Synchronisiere...',
    groupMatches: '⚽ Gruppenspiele',
    liveStandings: '🏆 Live-Tabellen',
    matchTree: '🛡️ K.o.-Runden Baum',
    round32: 'Runde der 32',
    round16: 'Achtelfinale',
    quarterFinals: 'Viertelfinale',
    semiFinals: 'Halbfinale',
    thirdPlace: 'Spiel um Platz 3',
    final: 'Finale',
    allGroups: 'Alle Gruppen',
    group: 'Gruppe',
    liveSyncSuccess: 'Live-Ergebnisse erfolgreich aktualisiert!',
    liveSyncError: 'Fehler beim Abrufen der Live-Daten.',
    resetConfirm: 'Möchtest du wirklich alle Ergebnisse zurücksetzen?',
    saved: 'Gespeichert ✓',
    finalize: 'Abschließen',
    allRounds: 'Alle Runden',
    loading: 'Lade...',
    penalty: 'Elfmeter',
    timeMatrix: 'Zeit-Matrix',
    topScorers: 'Statistiken',
    selectTimezone: 'Zeitzone wählen',
    favoriteTooltip: 'Lieblingsland markieren/entfernen',
    teamLabel: 'Team',
    playedLabel: 'Sp',
    diffLabel: 'TD',
    pointsLabel: 'Pkt'
  },

  en: {
    title: 'FIFA World Cup 2026',
    subtitle: 'Results tracker & interactive tournament simulator. Enter scores or simulate the entire tournament.',
    groupStage: 'Group Stage',
    knockoutStage: 'Knockout Stage',
    simulateAll: '⚡ Simulate All',
    reset: '↺ Reset',
    liveSync: '🔄 Live Sync',
    liveSyncing: '⌛ Syncing...',
    groupMatches: '⚽ Group Matches',
    liveStandings: '🏆 Live Standings',
    matchTree: '🛡️ Knockout Bracket',
    round32: 'Round of 32',
    round16: 'Round of 16',
    quarterFinals: 'Quarter-finals',
    semiFinals: 'Semi-finals',
    thirdPlace: 'Third place play-off',
    final: 'Final',
    allGroups: 'All Groups',
    group: 'Group',
    liveSyncSuccess: 'Live results successfully updated!',
    liveSyncError: 'Error fetching live data.',
    resetConfirm: 'Do you really want to reset all results?',
    saved: 'Saved ✓',
    finalize: 'Finalize',
    allRounds: 'All Rounds',
    loading: 'Loading...',
    penalty: 'Penalties',
    timeMatrix: 'Time Matrix',
    topScorers: 'Stats',
    selectTimezone: 'Select Timezone',
    favoriteTooltip: 'Toggle favorite country',
    teamLabel: 'Team',
    playedLabel: 'GP',
    diffLabel: 'GD',
    pointsLabel: 'Pts'
  },

  es: {
    title: 'Copa Mundial de la FIFA 2026',
    subtitle: 'Rastreador de resultados y simulador interactivo de torneos. Introduce goles o simula todo el torneo.',
    groupStage: 'Fase de grupos',
    knockoutStage: 'Fase de eliminación',
    simulateAll: '⚡ Simular todo',
    reset: '↺ Restablecer',
    liveSync: '🔄 Sincronización',
    liveSyncing: '⌛ Sincronizando...',
    groupMatches: '⚽ Partidos de grupo',
    liveStandings: '🏆 Clasificación en vivo',
    matchTree: '🛡️ Cuadro de eliminatorias',
    round32: 'Dieciseisavos de final',
    round16: 'Octavos de final',
    quarterFinals: 'Cuartos de final',
    semiFinals: 'Semifinales',
    thirdPlace: 'Tercer puesto',
    final: 'Final',
    allGroups: 'Todos los grupos',
    group: 'Grupo',
    liveSyncSuccess: '¡Resultados actualizados con éxito!',
    liveSyncError: 'Error al obtener datos en vivo.',
    resetConfirm: '¿De verdad quieres restablecer todos los resultados?',
    saved: 'Guardado ✓',
    finalize: 'Finalizar',
    allRounds: 'Todas las rondas',
    loading: 'Cargando...',
    penalty: 'Penaltis',
    timeMatrix: 'Matriz de tiempo',
    topScorers: 'Estadísticas',
    selectTimezone: 'Seleccionar zona horaria',
    favoriteTooltip: 'Marcar/desmarcar país favorito',
    teamLabel: 'Equipo',
    playedLabel: 'PJ',
    diffLabel: 'DG',
    pointsLabel: 'Pts'
  },

  fr: {
    title: 'Coupe du Monde de la FIFA 2026',
    subtitle: 'Suivi des résultats & simulateur interactif. Saisissez les scores ou simulez l’ensemble du tournoi.',
    groupStage: 'Phase de groupes',
    knockoutStage: 'Phase finale',
    simulateAll: '⚡ Tout simuler',
    reset: '↺ Réinitialiser',
    liveSync: '🔄 Sync en direct',
    liveSyncing: '⌛ Synchronisation...',
    groupMatches: '⚽ Matchs de groupe',
    liveStandings: '🏆 Classements en direct',
    matchTree: '🛡️ Tableau final',
    round32: 'Seizièmes de finale',
    round16: 'Huitièmes de finale',
    quarterFinals: 'Quarts de finale',
    semiFinals: 'Demi-finales',
    thirdPlace: 'Troisième place',
    final: 'Finale',
    allGroups: 'Tous les groupes',
    group: 'Groupe',
    liveSyncSuccess: 'Résultats mis à jour avec succès !',
    liveSyncError: 'Erreur lors de la récupération des données.',
    resetConfirm: 'Voulez-vous vraiment réinitialiser tous les résultats ?',
    saved: 'Enregistré ✓',
    finalize: 'Finaliser',
    allRounds: 'Tous les tours',
    loading: 'Chargement...',
    penalty: 'Tirs au but',
    timeMatrix: 'Matrice de temps',
    topScorers: 'Stats',
    selectTimezone: 'Sélectionner le fuseau horaire',
    favoriteTooltip: 'Ajouter/retirer des pays favoris',
    teamLabel: 'Équipe',
    playedLabel: 'MJ',
    diffLabel: 'DB',
    pointsLabel: 'Pts'
  },

  ru: {
    title: 'Чемпионат мира по футболу 2026',
    subtitle: 'Трекер результатов и интерактивный симулятор. Вводите голы или симулируйте весь турнир.',
    groupStage: 'Групповой этап',
    knockoutStage: 'Плей-офф',
    simulateAll: '⚡ Симулировать всё',
    reset: '↺ Сбросить',
    liveSync: '🔄 Лайв-синхронизация',
    liveSyncing: '⌛ Синхронизация...',
    groupMatches: '⚽ Групповые матчи',
    liveStandings: '🏆 Таблицы лайв',
    matchTree: '🛡️ Сетка плей-офф',
    round32: '1/16 финала',
    round16: '1/8 финала',
    quarterFinals: 'Четвертьфиналы',
    semiFinals: 'Полуфиналы',
    thirdPlace: 'Матч за 3-е место',
    final: 'Финал',
    allGroups: 'Все группы',
    group: 'Группа',
    liveSyncSuccess: 'Результаты успешно обновлены!',
    liveSyncError: 'Ошибка при получении данных.',
    resetConfirm: 'Вы действительно хотите сбросить все результаты?',
    saved: 'Сохранено ✓',
    finalize: 'Завершить',
    allRounds: 'Все раунды',
    loading: 'Загрузка...',
    penalty: 'Пенальти',
    timeMatrix: 'Матрица времени',
    topScorers: 'Статистика',
    selectTimezone: 'Выберите часовой пояс',
    favoriteTooltip: 'Добавить/удалить любимую страну',
    teamLabel: 'Команда',
    playedLabel: 'И',
    diffLabel: 'РМ',
    pointsLabel: 'О'
  },

  uk: {
    title: 'Чемпіонат світу з футболу 2026',
    subtitle: 'Трекер результатів та інтерактивний симулятор. Вводьте голи або симулюйте весь турнір.',
    groupStage: 'Груповий етап',
    knockoutStage: 'Плей-офф',
    simulateAll: '⚡ Симулювати все',
    reset: '↺ Скинути',
    liveSync: '🔄 Лайв-синхронізація',
    liveSyncing: '⌛ Синхронізація...',
    groupMatches: '⚽ Групові матчі',
    liveStandings: '🏆 Таблиці наживо',
    matchTree: '🛡️ Сітка плей-офф',
    round32: '1/16 фіналу',
    round16: '1/8 фіналу',
    quarterFinals: 'Чвертьфінали',
    semiFinals: 'Півфінали',
    thirdPlace: 'Матч за 3-є місце',
    final: 'Фінал',
    allGroups: 'Всі групи',
    group: 'Група',
    liveSyncSuccess: 'Результати успішно оновлено!',
    liveSyncError: 'Помилка при отриманні даних.',
    resetConfirm: 'Ви дійсно хочете скинути всі результати?',
    saved: 'Збережено ✓',
    finalize: 'Завершити',
    allRounds: 'Всі раунди',
    loading: 'Завантаження...',
    penalty: 'Пенальті',
    timeMatrix: 'Матриця часу',
    topScorers: 'Статистика',
    selectTimezone: 'Виберіть часовий пояс',
    favoriteTooltip: 'Додати/видалити улюблену країну',
    teamLabel: 'Команда',
    playedLabel: 'І',
    diffLabel: 'РМ',
    pointsLabel: 'О'
  }
};

export const TEAM_TRANSLATIONS: Record<string, Record<Language, string>> = {
  CZE: { de: 'Tschechien', en: 'Czech Republic', es: 'República Checa', fr: 'République Tchèque', ru: 'Чехия', uk: 'Чехія' },
  KOR: { de: 'Südkorea', en: 'South Korea', es: 'Corea del Sur', fr: 'Corée du Sud', ru: 'Южная Корея', uk: 'Південна Корея' },
  MEX: { de: 'Mexiko', en: 'Mexico', es: 'México', fr: 'Mexique', ru: 'Мексика', uk: 'Мексика' },
  RSA: { de: 'Südafrika', en: 'South Africa', es: 'Sudáfrica', fr: 'Afrique du Sud', ru: 'Южная Африка', uk: 'ПАР' },
  BIH: { de: 'Bosnien und Herzegowina', en: 'Bosnia and Herzegovina', es: 'Bosnia y Herzegovina', fr: 'Bosnie-Herzégovine', ru: 'Босния и Герцеговина', uk: 'Боснія і Герцеговина' },
  CAN: { de: 'Kanada', en: 'Canada', es: 'Canadá', fr: 'Canada', ru: 'Канада', uk: 'Канада' },
  CHE: { de: 'Schweiz', en: 'Switzerland', es: 'Suiza', fr: 'Suisse', ru: 'Швейцария', uk: 'Швейцарія' },
  QAT: { de: 'Katar', en: 'Qatar', es: 'Catar', fr: 'Qatar', ru: 'Катар', uk: 'Катар' },
  BRA: { de: 'Brasilien', en: 'Brazil', es: 'Brasil', fr: 'Brésil', ru: 'Бразилия', uk: 'Бразилія' },
  HTI: { de: 'Haiti', en: 'Haiti', es: 'Haití', fr: 'Haïti', ru: 'Гаити', uk: 'Гаїті' },
  MAR: { de: 'Marokko', en: 'Morocco', es: 'Marruecos', fr: 'Maroc', ru: 'Марокко', uk: 'Марокко' },
  SCT: { de: 'Schottland', en: 'Scotland', es: 'Escocia', fr: 'Écosse', ru: 'Шотландия', uk: 'Шотландія' },
  AUS: { de: 'Australien', en: 'Australia', es: 'Australia', fr: 'Australie', ru: 'Австралия', uk: 'Австралія' },
  PAR: { de: 'Paraguay', en: 'Paraguay', es: 'Paraguay', fr: 'Paraguay', ru: 'Парагвай', uk: 'Парагвай' },
  TUR: { de: 'Türkei', en: 'Turkey', es: 'Turquía', fr: 'Turquie', ru: 'Турция', uk: 'Туреччина' },
  USA: { de: 'USA', en: 'USA', es: 'Estados Unidos', fr: 'États-Unis', ru: 'США', uk: 'США' },
  CIV: { de: 'Elfenbeinküste', en: 'Ivory Coast', es: 'Costa de Marfil', fr: "Côte d'Ivoire", ru: "Кот-d'Ивуар", uk: "Кот-д'Івуар" },
  CUW: { de: 'Curaçao', en: 'Curaçao', es: 'Curazao', fr: 'Curaçao', ru: 'Кюрасао', uk: 'Кюрасао' },
  DEU: { de: 'Deutschland', en: 'Germany', es: 'Alemania', fr: 'Allemagne', ru: 'Германия', uk: 'Німеччина' },
  ECU: { de: 'Ecuador', en: 'Ecuador', es: 'Ecuador', fr: 'Équateur', ru: 'Эквадор', uk: 'Еквадор' },
  JPN: { de: 'Japan', en: 'Japan', es: 'Japón', fr: 'Japon', ru: 'Япония', uk: 'Японія' },
  NLD: { de: 'Niederlande', en: 'Netherlands', es: 'Países Bajos', fr: 'Pays-Bas', ru: 'Нидерланды', uk: 'Нідерланди' },
  SWE: { de: 'Schweden', en: 'Sweden', es: 'Suecia', fr: 'Suède', ru: 'Швеция', uk: 'Швеція' },
  TUN: { de: 'Tunesien', en: 'Tunisia', es: 'Túnez', fr: 'Tunisie', ru: 'Тунис', uk: 'Туніс' },
  BEL: { de: 'Belgien', en: 'Belgium', es: 'Bélgica', fr: 'Belgique', ru: 'Бельгия', uk: 'Бельгія' },
  EGY: { de: 'Ägypten', en: 'Egypt', es: 'Egipto', fr: 'Égypte', ru: 'Египет', uk: 'Єгипет' },
  IRN: { de: 'Iran', en: 'Iran', es: 'Irán', fr: 'Iran', ru: 'Иран', uk: 'Іран' },
  NZL: { de: 'Neuseeland', en: 'New Zealand', es: 'Nueva Zelanda', fr: 'Nouvelle-Zélande', ru: 'Новая Зеландия', uk: 'Нова Зеландія' },
  CPV: { de: 'Kap Verde', en: 'Cape Verde', es: 'Cabo Verde', fr: 'Cap-Vert', ru: 'Кабо-Верде', uk: 'Кабо-Верде' },
  ESP: { de: 'Spanien', en: 'Spain', es: 'España', fr: 'Espagne', ru: 'Испания', uk: 'Іспанія' },
  SAU: { de: 'Saudi-Arabien', en: 'Saudi Arabia', es: 'Arabia Saudita', fr: 'Arabie Saoudite', ru: 'Саудовская Аравия', uk: 'Саудівська Аравія' },
  URY: { de: 'Uruguay', en: 'Uruguay', es: 'Uruguay', fr: 'Uruguay', ru: 'Уругвай', uk: 'Уругвай' },
  FRA: { de: 'Frankreich', en: 'France', es: 'Francia', fr: 'France', ru: 'Франция', uk: 'Франція' },
  IRQ: { de: 'Irak', en: 'Iraq', es: 'Irak', fr: 'Irak', ru: 'Ирак', uk: 'Ірак' },
  NOR: { de: 'Norwegen', en: 'Norway', es: 'Noruega', fr: 'Norvège', ru: 'Норвегия', uk: 'Норвегія' },
  SEN: { de: 'Senegal', en: 'Senegal', es: 'Senegal', fr: 'Sénégal', ru: 'Сенегал', uk: 'Сенегал' },
  ARG: { de: 'Argentinien', en: 'Argentina', es: 'Argentina', fr: 'Argentine', ru: 'Аргентина', uk: 'Аргентина' },
  AUT: { de: 'Österreich', en: 'Austria', es: 'Austria', fr: 'Autriche', ru: 'Австрия', uk: 'Австрія' },
  DZA: { de: 'Algerien', en: 'Algeria', es: 'Argelia', fr: 'Algérie', ru: 'Алжир', uk: 'Алжир' },
  JOR: { de: 'Jordanien', en: 'Jordan', es: 'Jordania', fr: 'Jordanie', ru: 'Иордания', uk: 'Йорданія' },
  COD: { de: 'DR Kongo', en: 'DR Congo', es: 'RD Congo', fr: 'RD Congo', ru: 'ДР Конго', uk: 'ДР Конго' },
  COL: { de: 'Kolumbien', en: 'Colombia', es: 'Colombia', fr: 'Colombie', ru: 'Колумбия', uk: 'Колумбія' },
  PRT: { de: 'Portugal', en: 'Portugal', es: 'Portugal', fr: 'Portugal', ru: 'Португалия', uk: 'Португалія' },
  UZB: { de: 'Usbekistan', en: 'Uzbekistan', es: 'Uzbekistán', fr: 'Ouzbékistan', ru: 'Узбекистан', uk: 'Узбекистан' },
  ENG: { de: 'England', en: 'England', es: 'Inglaterra', fr: 'Angleterre', ru: 'Англия', uk: 'Англія' },
  GHA: { de: 'Ghana', en: 'Ghana', es: 'Ghana', fr: 'Ghana', ru: 'Гана', uk: 'Гана' },
  HRV: { de: 'Kroatien', en: 'Croatia', es: 'Croacia', fr: 'Croatie', ru: 'Хорватия', uk: 'Хорватія' },
  PAN: { de: 'Panama', en: 'Panama', es: 'Panamá', fr: 'Panama', ru: 'Панама', uk: 'Панама' }
};
