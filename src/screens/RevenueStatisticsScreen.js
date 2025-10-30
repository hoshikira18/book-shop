import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  getTotalRevenue,
  getTodayRevenue,
  getMonthRevenue,
  getYearRevenue,
  getOrderCount,
  getRevenueByday,
  getRevenueByMonth,
  getTopSellingProducts,
} from '../utils/database';
import { theme } from '../theme';
import { formatCurrency } from '../utils/currency';

export const RevenueStatisticsScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'today', 'month', 'year'
  const [statistics, setStatistics] = useState({
    totalRevenue: 0,
    todayRevenue: 0,
    monthRevenue: 0,
    yearRevenue: 0,
    orderCount: 0,
    dailyRevenue: [],
    monthlyRevenue: [],
    topProducts: [],
  });

  const loadStatistics = useCallback(async () => {
    try {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;

      const [
        total,
        today,
        month,
        year,
        orderCount,
        dailyRevenue,
        monthlyRevenue,
        topProducts,
      ] = await Promise.all([
        getTotalRevenue(),
        getTodayRevenue(),
        getMonthRevenue(currentYear, currentMonth),
        getYearRevenue(currentYear),
        getOrderCount(),
        getRevenueByday(7),
        getRevenueByMonth(currentYear),
        getTopSellingProducts(5),
      ]);

      setStatistics({
        totalRevenue: total,
        todayRevenue: today,
        monthRevenue: month,
        yearRevenue: year,
        orderCount: orderCount,
        dailyRevenue: dailyRevenue,
        monthlyRevenue: monthlyRevenue,
        topProducts: topProducts,
      });
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadStatistics();
  }, [loadStatistics]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadStatistics();
  }, [loadStatistics]);

  const getFilteredRevenue = () => {
    switch (filter) {
      case 'today':
        return statistics.todayRevenue;
      case 'month':
        return statistics.monthRevenue;
      case 'year':
        return statistics.yearRevenue;
      default:
        return statistics.totalRevenue;
    }
  };

  const getFilterLabel = () => {
    switch (filter) {
      case 'today':
        return "Today's Revenue";
      case 'month':
        return 'This Month';
      case 'year':
        return 'This Year';
      default:
        return 'Total Revenue';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getMonthName = (monthNumber) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[parseInt(monthNumber) - 1];
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading statistics...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Revenue Statistics</Text>
          <Text style={styles.subtitle}>Track your sales performance</Text>
        </View>

        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
              All Time
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'today' && styles.filterButtonActive]}
            onPress={() => setFilter('today')}
          >
            <Text style={[styles.filterText, filter === 'today' && styles.filterTextActive]}>
              Today
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'month' && styles.filterButtonActive]}
            onPress={() => setFilter('month')}
          >
            <Text style={[styles.filterText, filter === 'month' && styles.filterTextActive]}>
              Month
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'year' && styles.filterButtonActive]}
            onPress={() => setFilter('year')}
          >
            <Text style={[styles.filterText, filter === 'year' && styles.filterTextActive]}>
              Year
            </Text>
          </TouchableOpacity>
        </View>

        {/* Main Revenue Card */}
        <View style={styles.revenueCard}>
          <Text style={styles.revenueLabel}>{getFilterLabel()}</Text>
          <Text style={styles.revenueAmount}>{formatCurrency(getFilteredRevenue())}</Text>
          <Text style={styles.orderCount}>{statistics.orderCount} orders completed</Text>
        </View>

        {/* Quick Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Today</Text>
            <Text style={styles.statValue}>{formatCurrency(statistics.todayRevenue)}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>This Month</Text>
            <Text style={styles.statValue}>{formatCurrency(statistics.monthRevenue)}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>This Year</Text>
            <Text style={styles.statValue}>{formatCurrency(statistics.yearRevenue)}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Orders</Text>
            <Text style={styles.statValue}>{statistics.orderCount}</Text>
          </View>
        </View>

        {/* Daily Revenue Chart */}
        {statistics.dailyRevenue.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Last 7 Days</Text>
            <View style={styles.chartContainer}>
              {statistics.dailyRevenue.reverse().map((item, index) => (
                <View key={index} style={styles.chartItem}>
                  <View style={styles.chartBar}>
                    <View
                      style={[
                        styles.chartBarFill,
                        {
                          height: `${Math.min((item.revenue / Math.max(...statistics.dailyRevenue.map(d => d.revenue))) * 100, 100)}%`,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.chartLabel}>{formatDate(item.date)}</Text>
                  <Text style={styles.chartValue}>{formatCurrency(item.revenue)}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Monthly Revenue */}
        {statistics.monthlyRevenue.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Monthly Revenue (This Year)</Text>
            <View style={styles.listContainer}>
              {statistics.monthlyRevenue.map((item, index) => (
                <View key={index} style={styles.listItem}>
                  <View style={styles.listItemLeft}>
                    <Text style={styles.listItemMonth}>{getMonthName(item.month)}</Text>
                    <Text style={styles.listItemOrders}>{item.order_count} orders</Text>
                  </View>
                  <Text style={styles.listItemRevenue}>{formatCurrency(item.revenue)}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Top Selling Products */}
        {statistics.topProducts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Top Selling Products</Text>
            <View style={styles.listContainer}>
              {statistics.topProducts.map((item, index) => (
                <View key={index} style={styles.productItem}>
                  <View style={styles.productRank}>
                    <Text style={styles.productRankText}>{index + 1}</Text>
                  </View>
                  <View style={styles.productInfo}>
                    <Text style={styles.productTitle} numberOfLines={1}>
                      {item.book_title}
                    </Text>
                    <Text style={styles.productSales}>{item.total_sold} sold</Text>
                  </View>
                  <Text style={styles.productRevenue}>{formatCurrency(item.revenue)}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Empty State */}
        {statistics.orderCount === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>📊</Text>
            <Text style={styles.emptyStateTitle}>No sales data yet</Text>
            <Text style={styles.emptyStateDescription}>
              Statistics will appear here once orders are placed
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#fff',
  },
  revenueCard: {
    margin: theme.spacing.md,
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    alignItems: 'center',
  },
  revenueLabel: {
    fontSize: theme.fontSize.md,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  revenueAmount: {
    fontSize: 48,
    fontWeight: theme.fontWeight.bold,
    color: '#fff',
    marginBottom: 8,
  },
  orderCount: {
    fontSize: theme.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: theme.spacing.sm,
    gap: 8,
  },
  statCard: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: '#fff',
    padding: theme.spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  section: {
    margin: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    backgroundColor: '#fff',
    padding: theme.spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    height: 200,
  },
  chartItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },
  chartBar: {
    width: 30,
    height: '70%',
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  chartBarFill: {
    width: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  chartLabel: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  chartValue: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.text,
  },
  listContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  listItemLeft: {
    flex: 1,
  },
  listItemMonth: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text,
  },
  listItemOrders: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  listItemRevenue: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  productRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  productRankText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: '#fff',
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text,
  },
  productSales: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  productRevenue: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },
  emptyState: {
    alignItems: 'center',
    padding: theme.spacing.xl,
    marginTop: 40,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: theme.spacing.md,
  },
  emptyStateTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  emptyStateDescription: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});
