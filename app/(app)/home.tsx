import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useNavigation } from 'expo-router';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Colors, Typography, Spacing, Shadows, BorderRadius } from '../../constants/theme';
import { TopAppBar } from '../../components/ui/TopAppBar';
import { TrustIndicatorDot } from '../../components/ui/TrustIndicatorDot';
import { useBalance } from '../../context/BalanceContext';
import { getProfile } from '../../services/auth';

export default function HomeScreen() {
  const router = useRouter();
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const [showBalance, setShowBalance] = useState(true);
  const { balance } = useBalance();
  const [firstName, setFirstName] = useState('Rahul Kapoor');

  useEffect(() => {
    getProfile().then((profile) => {
      if (profile?.fullName) setFirstName(profile.fullName);
    });
  }, []);

  const toggleBalance = () => setShowBalance(!showBalance);

  const quickActions = [
    { label: 'Transfer', icon: 'swap-horiz', color: Colors.primaryContainer, route: '/(app)/transfer' },
    { label: 'Pay Bills', icon: 'receipt', color: Colors.secondaryContainer, route: '/(app)/pay' },
    { label: 'Scan QR', icon: 'qr-code-scanner', color: Colors.tertiaryContainer, route: null },
    { label: 'Invest', icon: 'trending-up', color: Colors.errorContainer, route: null },
  ];

  const recentTransactions = [
    { id: '1', name: 'Big Bazaar', amount: '-₹84.50', category: 'Groceries', date: 'Today, 2:45 PM', icon: 'shopping-cart', iconBg: Colors.secondaryContainer, iconColor: Colors.onSecondaryContainer, isPositive: false },
    { id: '2', name: 'Netflix', amount: '-₹15.99', category: 'Entertainment', date: 'Yesterday, 8:00 AM', icon: 'movie', iconBg: Colors.tertiaryContainer, iconColor: Colors.onTertiaryContainer, isPositive: false },
    { id: '3', name: 'Salary', amount: '+₹4,250.00', category: 'Income', date: 'Oct 25, 9:00 AM', icon: 'work', iconBg: Colors.primaryContainer, iconColor: Colors.onPrimaryContainer, isPositive: true },
  ];

  const RightElement = () => (
    <View style={styles.avatarContainer}>
      <Image 
        source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYQjBgeQDeL4JdgQLQTNs6N5dkEhVauZMUCcHKvAMrKNFe3v6t_02_8LTqiaSeOQafTBon_m18Gxmns89OPvk06uKEXhxcvnL66O_zrmjTONka4RWnGkPuDy6izVg74IwveKr75UUXszRLsJ_WtqtxMCzrs394mNf76OIjflVp5o_WVp9jlTY7osmc1hrLnOUwrzzU5f1H5137udqy8Om7aKv-fWjMFLH3WiTWV18pVVCTAPkjhUbxX5vEVlZcIhNQmNB0ze_hovUw' }}
        style={styles.avatarImage}
      />
      <TrustIndicatorDot score={95} />
    </View>
  );

  return (
    <View style={styles.container}>
      <TopAppBar 
        showMenuIcon 
        onMenuPress={() => navigation.openDrawer()} 
        rightElement={<RightElement />} 
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Greeting */}
        <View style={styles.greeting}>
          <Text style={styles.greetingText}>Good Morning,</Text>
          <Text style={styles.greetingName}>{firstName}</Text>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceDecorativeBlob} />
          
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <TouchableOpacity onPress={toggleBalance} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <MaterialIcons name={showBalance ? "visibility" : "visibility-off"} size={20} color={Colors.secondary} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.balanceAmount}>
            {showBalance ? `₹${balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '••••••••'}
          </Text>

          <View style={styles.balanceActions}>
            <TouchableOpacity style={styles.primaryAction}>
              <Text style={styles.primaryActionText}>Passbook</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryAction} onPress={() => router.push('/(app)/cards')}>
              <Text style={styles.secondaryActionText}>Cards</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions (Bento Grid) */}
        <View style={styles.bentoGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.bentoItem}
              onPress={() => action.route && router.push(action.route as any)}
            >
              <View style={[styles.bentoIconWrapper, { backgroundColor: action.color + '33' }]}>
                <MaterialIcons name={action.icon as any} size={28} color={Colors.primary} />
              </View>
              <Text style={styles.bentoLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Transactions */}
        <View style={styles.transactionsSection}>
          <View style={styles.transactionsHeader}>
            <Text style={styles.transactionsTitle}>Recent Transactions</Text>
            <Text style={styles.transactionsLink}>View All</Text>
          </View>

          <View style={styles.transactionsList}>
            {recentTransactions.map((tx) => (
              <View key={tx.id} style={styles.txRow}>
                <View style={[styles.txIconWrapper, { backgroundColor: tx.iconBg }]}>
                  <MaterialIcons name={tx.icon as any} size={20} color={tx.iconColor} />
                </View>
                <View style={styles.txDetails}>
                  <Text style={styles.txName}>{tx.name}</Text>
                  <Text style={styles.txDate}>{tx.date}</Text>
                </View>
                <View style={styles.txAmounts}>
                  <Text style={[styles.txAmount, { color: tx.isPositive ? '#4ade80' : Colors.onSurface }]}>
                    {tx.amount}
                  </Text>
                  <View style={styles.txCategoryPill}>
                    <Text style={styles.txCategoryText}>{tx.category}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  scrollContent: {
    padding: Spacing.marginMobile,
    paddingBottom: 100, // Make room for BottomNavBar
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  greeting: {
    marginBottom: Spacing.stackLg,
  },
  greetingText: {
    ...Typography.bodyLg,
    color: Colors.onSurfaceVariant,
  },
  greetingName: {
    ...Typography.displayLg,
    color: Colors.onSurface,
    marginTop: -4,
  },
  balanceCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.lg,
    padding: Spacing.stackLg,
    ...Shadows.low,
    borderWidth: 1,
    borderColor: Colors.surfaceContainerHigh,
    marginBottom: Spacing.stackLg,
    overflow: 'hidden',
  },
  balanceDecorativeBlob: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary + '1A', // 10% opacity
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  balanceLabel: {
    ...Typography.bodySm,
    color: Colors.onSurfaceVariant,
  },
  balanceAmount: {
    ...Typography.displayLg,
    color: Colors.primary,
    marginBottom: Spacing.stackMd,
  },
  balanceActions: {
    flexDirection: 'row',
    gap: Spacing.stackSm,
  },
  primaryAction: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: BorderRadius.DEFAULT,
    alignItems: 'center',
  },
  primaryActionText: {
    ...Typography.labelMd,
    color: Colors.onPrimary,
  },
  secondaryAction: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.secondary,
    paddingVertical: 12,
    borderRadius: BorderRadius.DEFAULT,
    alignItems: 'center',
  },
  secondaryActionText: {
    ...Typography.labelMd,
    color: Colors.secondary,
  },
  bentoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Spacing.stackLg,
  },
  bentoItem: {
    width: '23%',
    alignItems: 'center',
  },
  bentoIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  bentoLabel: {
    ...Typography.labelMd,
    color: Colors.onSurface,
    textAlign: 'center',
  },
  transactionsSection: {
    marginBottom: Spacing.stackLg,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.stackMd,
  },
  transactionsTitle: {
    ...Typography.headlineSm,
    color: Colors.onSurface,
  },
  transactionsLink: {
    ...Typography.labelMd,
    color: Colors.primary,
  },
  transactionsList: {
    gap: Spacing.stackMd,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  txDetails: {
    flex: 1,
  },
  txName: {
    ...Typography.bodyMd,
    fontFamily: 'WorkSans-Medium',
    color: Colors.onSurface,
  },
  txDate: {
    ...Typography.bodySm,
    color: Colors.onSurfaceVariant,
  },
  txAmounts: {
    alignItems: 'flex-end',
  },
  txAmount: {
    ...Typography.bodyMd,
    fontFamily: 'WorkSans-Bold',
    marginBottom: 4,
  },
  txCategoryPill: {
    backgroundColor: Colors.surfaceContainerHighest,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  txCategoryText: {
    ...Typography.labelMd,
    fontSize: 10,
    color: Colors.onSurfaceVariant,
  },
});
