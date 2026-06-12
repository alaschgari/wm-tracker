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
    penalty: 'Elfmeter'
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
    penalty: 'Penalties'
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
    penalty: 'Penaltis'
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
    penalty: 'Tirs au but'
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
    penalty: 'Пенальти'
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
    penalty: 'Пенальті'
  }
};
