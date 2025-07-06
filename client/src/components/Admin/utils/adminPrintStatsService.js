// utils/adminPrintStatsService.js
const AdminPrintStatsService = {
  getFormattedStats: async () => {
    try {
   

      const response = await fetch('/api/students/stats/admin-printed-summary', {
        credentials:"include"
      });

      if (!response.ok) {
        throw new Error('Failed to fetch admin printed stats');
      }

      const data = await response.json();

      const groupedByDate = data.groupedByDate || {}; // Optional if you're grouping

      return {
        total: data.totalPrints || 0,
        groupedByDate,
        lastPrintDate: data.lastPrintDate || null
      };
    } catch (error) {
      console.error('AdminPrintStatsService error:', error);
      return {
        total: 0,
        groupedByDate: {},
        lastPrintDate: null
      };
    }
  }
};

export default AdminPrintStatsService;
