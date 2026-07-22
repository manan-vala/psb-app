import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useNavigation } from 'expo-router';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Colors, Typography, Spacing, Shadows, BorderRadius } from '../../constants/theme';
import { TopAppBar } from '../../components/ui/TopAppBar';
import { Button } from '../../components/ui/Button';
import { useBalance } from '../../context/BalanceContext';

export default function TransferScreen() {
  const router = useRouter();
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const { balance } = useBalance();

  const [amount, setAmount] = React.useState('0.00');
  
  const handleAddAmount = (add: number) => {
    const current = parseFloat(amount || '0');
    setAmount((current + add).toFixed(2));
  };

  const payees = [
    { id: '1', name: 'Priya Sharma', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfyT3UT_op-sHBXbUGCKL3ZGr9G1fZG-FZ-2M-NW0tpJ6oerySTSMgEfv1_odRPsJrBYkWxflGubhratlvQrRyTNRaMMsxNqhNIEuKk7gQIZueobNOILrllWk633Ji1RmA9-yBGq_Qxzc7Ua-4UYhQNoqJp_NpMWmXYVv80sT2LiioCNlzBoZBg8bpSQOwZKtfZTD6TVYgdUBvHWm7bf2jdb0UXC_GWJqE77RAIl-bgEVEchN4QMSq_JCg7l6ELUkKxd5Cd-DHWnCo' },
    { id: '2', name: 'Ravi Kumar', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAC1FicObCh0HS6f2za2NOcFFWk24ajeCD0FXmHqrSWs_4pjI0CLnWCPWeIFpdHwEEi3xhNIQnznIJFQWHd6Hl5v2ifBqbEBgnzfbgy9SVn9YhW6UC9Rw11Vc445PnmySAluZIgnMdljl9FijD0bAIjMuKGLDmC9az-y0y07UZME1-EEgdNKpjVtN-UIsS73DAIiFkFf6rA8rz_Mh2ae8t1g0niHV1e5iF9n2xiqe9sCDvw-IZBDOC9Ur9DtlZwLPDYiJZurm3l2c1S' },
    { id: '3', name: 'Anjali Desai', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5xnSJdvFWl6cPlBOZnryIMvRdyIdcnuIsgTf82R29V3uGQNqlAh8PLDzBGwbFL1IAbF5Cv84q52CGbXKnmH9knrledqasFWPhXA5yNXL7NMVpuT9LvSKsxyJooZSjv-8VAIyQPEm74cEtCnbB6GR9oxz-1yNMwvxqyh2cphk34EEhRzlL1yVXdYbVfjswhODbjZT9-Aje2FTzKmpVoEBu0KvPdt9PrShqh-4XXLY7bufstbmIHiDY_QgzIiWGdpwhxzcpyF958swN' },
    { id: '4', name: 'Arjun Singh', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDY_kqX5eaWPevvkdsFx9nQa4PSS70ogLQ0mFr-HJw_jK3eUqYC7--vxDsBUkTv4ofkkl2QiAq2XnhvAPbi1t2sScH_j3m2JBtVvSxPwKMVpUBj7S5uQX8ESTH00KswuCMs924cZcQxDh6rUQ2zIf_grGXxYDqs7r__f3o8ITYMu4E8MHPsQn2RH3dSpIBOywcmMvfRHnfjEZgeO2wS30o_n6MMHL6cTD9HCBPClGwSX_3vbuSpzoLAikKSI3q4hUGLsB2d8lBQihK1' },
  ];

  const [selectedPayee, setSelectedPayee] = React.useState<string | null>(null);

  const RightElement = () => (
    <View style={styles.avatarContainer}>
      <Image 
        source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYQjBgeQDeL4JdgQLQTNs6N5dkEhVauZMUCcHKvAMrKNFe3v6t_02_8LTqiaSeOQafTBon_m18Gxmns89OPvk06uKEXhxcvnL66O_zrmjTONka4RWnGkPuDy6izVg74IwveKr75UUXszRLsJ_WtqtxMCzrs394mNf76OIjflVp5o_WVp9jlTY7osmc1hrLnOUwrzzU5f1H5137udqy8Om7aKv-fWjMFLH3WiTWV18pVVCTAPkjhUbxX5vEVlZcIhNQmNB0ze_hovUw' }}
        style={styles.avatarImage}
      />
    </View>
  );

  const handleContinue = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount greater than 0.');
      return;
    }
    if (numAmount > balance) {
      Alert.alert('Insufficient Funds', 'You do not have enough balance for this transfer.');
      return;
    }
    if (!selectedPayee) {
      Alert.alert('Select Payee', 'Please select a payee before continuing.');
      return;
    }
    const payee = payees.find(p => p.id === selectedPayee);
    router.push({
      pathname: '/(app)/confirm',
      params: { 
        amount: numAmount.toFixed(2), 
        payeeName: payee?.name || 'Unknown' 
      }
    });
  };

  return (
    <View style={styles.container}>
      <TopAppBar 
        title="Transfer"
        showMenuIcon 
        onMenuPress={() => navigation.openDrawer()} 
        rightElement={<RightElement />} 
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* From Account */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>FROM ACCOUNT</Text>
          <TouchableOpacity style={styles.accountCard}>
            <View style={styles.accountLeft}>
              <View style={styles.accountIconWrapper}>
                <MaterialIcons name="account-balance-wallet" size={20} color={Colors.onSecondaryContainer} />
              </View>
              <View>
                <Text style={styles.accountName}>Everyday Checking</Text>
                <Text style={styles.accountBalance}>Available: ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
              </View>
            </View>
            <MaterialIcons name="expand-more" size={24} color={Colors.onSurfaceVariant} />
          </TouchableOpacity>
        </View>

        {/* Amount Input */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { textAlign: 'center' }]}>AMOUNT</Text>
          <View style={styles.amountCard}>
            <View style={styles.amountInputRow}>
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput
                style={styles.amountInput}
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                placeholderTextColor={Colors.primaryFixedDim}
              />
            </View>
            <View style={styles.quickAddRow}>
              <TouchableOpacity style={styles.quickAddPill} onPress={() => handleAddAmount(50)}>
                <Text style={styles.quickAddText} numberOfLines={1}>+ ₹50</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickAddPill} onPress={() => handleAddAmount(100)}>
                <Text style={styles.quickAddText} numberOfLines={1}>+ ₹100</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickAddPill} onPress={() => handleAddAmount(500)}>
                <Text style={styles.quickAddText} numberOfLines={1}>+ ₹500</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Select Payee */}
        <View style={styles.section}>
          <View style={styles.payeeHeader}>
            <Text style={styles.sectionLabel}>SELECT PAYEE</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.payeeList}>
            {/* Add New */}
            <TouchableOpacity style={styles.payeeItem}>
              <View style={[styles.payeeImageContainer, styles.payeeAddContainer]}>
                <MaterialIcons name="add" size={24} color={Colors.secondary} />
              </View>
              <Text style={styles.payeeName}>New</Text>
            </TouchableOpacity>

            {/* Payees */}
            {payees.map((p) => {
              const isSelected = selectedPayee === p.id;
              return (
                <TouchableOpacity key={p.id} style={styles.payeeItem} onPress={() => setSelectedPayee(p.id)}>
                  <View style={[styles.payeeImageContainer, isSelected && styles.payeeSelected]}>
                    <Image source={{ uri: p.image }} style={styles.payeeImage} />
                  </View>
                  <Text style={styles.payeeName} numberOfLines={1}>{p.name}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Note */}
        <View style={styles.section}>
          <View style={styles.noteInputContainer}>
            <MaterialIcons name="edit-note" size={24} color={Colors.onSurfaceVariant + '80'} style={styles.noteIcon} />
            <TextInput
              style={styles.noteInput}
              placeholder="Add a note (optional)"
              placeholderTextColor={Colors.onSurfaceVariant + '80'}
            />
          </View>
        </View>

        <View style={styles.spacer} />

        <Button 
          label="Continue" 
          icon="arrow-forward" 
          onPress={handleContinue}
        />

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
    flexGrow: 1,
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  section: {
    marginBottom: Spacing.stackLg,
  },
  sectionLabel: {
    ...Typography.labelMd,
    color: Colors.onSurfaceVariant,
    marginBottom: 8,
    paddingLeft: 4,
  },
  accountCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.DEFAULT,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.outlineVariant + '40',
    ...Shadows.low,
  },
  accountLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.secondaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  accountName: {
    ...Typography.bodyMd,
    fontFamily: 'WorkSans-SemiBold',
    color: Colors.onSurface,
  },
  accountBalance: {
    ...Typography.bodySm,
    color: Colors.onSurfaceVariant,
  },
  amountCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.xl,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.outlineVariant + '40',
    ...Shadows.low,
  },
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  currencySymbol: {
    ...Typography.displayLg,
    color: Colors.secondary,
    opacity: 0.8,
    marginRight: 4,
  },
  amountInput: {
    ...Typography.displayLg,
    color: Colors.primary,
    textAlign: 'center',
    minWidth: 120,
    maxWidth: '75%',
    padding: 0,
  },
  quickAddRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  quickAddPill: {
    backgroundColor: Colors.surfaceContainerHigh,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    flexShrink: 0,
  },
  quickAddText: {
    ...Typography.labelMd,
    color: Colors.onSurface,
    flexShrink: 0,
  },
  payeeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  seeAllText: {
    ...Typography.labelMd,
    color: Colors.primary,
  },
  payeeList: {
    gap: 16,
    paddingVertical: 4,
  },
  payeeItem: {
    alignItems: 'center',
    width: 72,
  },
  payeeImageContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    ...Shadows.low,
  },
  payeeSelected: {
    borderColor: Colors.primary,
  },
  payeeImage: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
  },
  payeeAddContainer: {
    backgroundColor: Colors.surfaceContainer,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.secondary + '4D', // 30% opacity
    justifyContent: 'center',
    alignItems: 'center',
  },
  payeeName: {
    ...Typography.labelMd,
    color: Colors.onSurface,
    textAlign: 'center',
  },
  noteInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: Colors.outlineVariant + '40',
    borderRadius: BorderRadius.DEFAULT,
    height: 48,
    paddingHorizontal: 12,
    ...Shadows.low,
  },
  noteIcon: {
    marginRight: 8,
  },
  noteInput: {
    flex: 1,
    ...Typography.bodyMd,
    color: Colors.onSurface,
  },
  spacer: {
    flex: 1,
    minHeight: 32,
  }
});
