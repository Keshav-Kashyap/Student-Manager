// utils/printStatsService.js
// Separate utility file for Print Statistics - can be imported anywhere

const PrintStatsService = {
  // Get all print statistics
  getStats: () => {
    const stats = localStorage.getItem('printStats');
    return stats ? JSON.parse(stats) : {
      totalPrints: 0,
      todayPrints: 0,
      thisWeekPrints: 0,
      thisMonthPrints: 0,
      lastPrintDate: null,
      printHistory: []
    };
  },

  // Update print statistics
  updateStats: (printedCount) => {
    const now = new Date();
    const today = now.toDateString();
    const currentStats = PrintStatsService.getStats();
    
    // Calculate week and month boundaries
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Reset daily count if new day
    if (currentStats.lastPrintDate !== today) {
      currentStats.todayPrints = 0;
      
      // Reset weekly count if new week
      const lastPrintDate = new Date(currentStats.lastPrintDate);
      if (lastPrintDate < startOfWeek) {
        currentStats.thisWeekPrints = 0;
      }
      
      // Reset monthly count if new month
      if (lastPrintDate < startOfMonth) {
        currentStats.thisMonthPrints = 0;
      }
    }
    
    // Update counts
    const updatedStats = {
      totalPrints: currentStats.totalPrints + printedCount,
      todayPrints: currentStats.todayPrints + printedCount,
      thisWeekPrints: currentStats.thisWeekPrints + printedCount,
      thisMonthPrints: currentStats.thisMonthPrints + printedCount,
      lastPrintDate: today,
      printHistory: [
        ...currentStats.printHistory,
        {
          date: now.toISOString(),
          count: printedCount,
          timestamp: now.getTime()
        }
      ].slice(-50) // Keep only last 50 print records
    };
    
    localStorage.setItem('printStats', JSON.stringify(updatedStats));
    return updatedStats;
  },

  // Clear all statistics (for reset functionality)
  clearStats: () => {
    localStorage.removeItem('printStats');
  },

  // Get formatted stats for display
  getFormattedStats: () => {
    const stats = PrintStatsService.getStats();
    return {
      total: stats.totalPrints,
      today: stats.todayPrints,
      week: stats.thisWeekPrints,
      month: stats.thisMonthPrints,
      lastPrint: stats.lastPrintDate ? new Date(stats.lastPrintDate).toLocaleDateString() : 'Never'
    };
  },

  // Get print history (last 10 prints)
  getRecentPrintHistory: () => {
    const stats = PrintStatsService.getStats();
    return stats.printHistory
      .slice(-10)
      .reverse()
      .map(print => ({
        date: new Date(print.date).toLocaleDateString(),
        time: new Date(print.date).toLocaleTimeString(),
        count: print.count
      }));
  },

  // Get stats for dashboard cards
  getDashboardStats: () => {
    const stats = PrintStatsService.getStats();
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

  // Check if printing was done today
  wasPrintedToday: () => {
    const stats = PrintStatsService.getStats();
    return stats.lastPrintDate === new Date().toDateString();
  },

  // Get average prints per day (last 30 days)
  getAveragePrintsPerDay: () => {
    const stats = PrintStatsService.getStats();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentPrints = stats.printHistory.filter(
      print => new Date(print.date) >= thirtyDaysAgo
    );
    
    const totalPrints = recentPrints.reduce((sum, print) => sum + print.count, 0);
    return Math.round(totalPrints / 30 * 10) / 10; // Round to 1 decimal
  }
};

export default PrintStatsService;