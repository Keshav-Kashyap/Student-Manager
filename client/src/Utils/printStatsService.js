import { API_BASE } from '../config/api';



const PrintStatsService = {
  getStats: async () => {
    try {
       
      const response = await fetch(`${API_BASE}/api/students/stats/user`, {
       credentials: "include",
      });

      if (!response.ok) throw new Error('Failed to fetch user stats');

      const data = await response.json();
      return {
        totalPrints: data.totalPrints || 0,
        todayPrints: data.todayPrints || 0,
        thisWeekPrints: data.thisWeekPrints || 0,
        thisMonthPrints: data.thisMonthPrints || 0,
        lastPrintDate: data.lastPrintDate || null
      };
    } catch (error) {
      console.error('User PrintStatsService error:', error);
      return {
        totalPrints: 0,
        todayPrints: 0,
        thisWeekPrints: 0,
        thisMonthPrints: 0,
        lastPrintDate: null
      };
    }
  },

  getDashboardStats: async () => {
    const stats = await PrintStatsService.getStats();
    return {
      totalPrints: {
        value: stats.totalPrints,
        label: 'Total ID Cards Printed',
        icon: '🖨️',
        color: 'blue'
      },
      todayPrints: {
        value: stats.todayPrints,
        label: 'Printed Today',
        icon: '📅',
        color: 'green'
      },
      weeklyPrints: {
        value: stats.thisWeekPrints,
        label: 'This Week',
        icon: '📊',
        color: 'purple'
      },
      monthlyPrints: {
        value: stats.thisMonthPrints,
        label: 'This Month',
        icon: '📈',
        color: 'orange'
      }
    };
  },

  getFormattedStats: async () => {
    const stats = await PrintStatsService.getStats();
    return {
      total: stats.totalPrints,
      today: stats.todayPrints,
      week: stats.thisWeekPrints,
      month: stats.thisMonthPrints,
      lastPrint: stats.lastPrintDate
        ? new Date(stats.lastPrintDate).toLocaleDateString()
        : 'Never'
    };
  }
};

export default PrintStatsService;
