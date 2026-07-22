import React, { useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  ScrollView,
  Share,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, Shadows, BorderRadius } from '../../constants/theme';
import { reportPayment } from '../../services/api';

// --- Confetti Particle ---
function ConfettiParticle({ delay, color, x }: { delay: number; color: string; x: number }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 1200,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [-20, 420] });
  const opacity = anim.interpolate({ inputRange: [0, 0.7, 1], outputRange: [1, 1, 0] });
  const rotate = anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${Math.random() > 0.5 ? 360 : -360}deg`] });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 0,
        left: x,
        width: 8,
        height: 8,
        borderRadius: Math.random() > 0.5 ? 4 : 1,
        backgroundColor: color,
        transform: [{ translateY }, { rotate }],
        opacity,
      }}
    />
  );
}

// --- Main Screen ---
export default function SuccessScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { amount, payeeName } = useLocalSearchParams<{ amount: string; payeeName: string }>();

  // Stable reference for the transaction
  const refNo = useRef(`PSB${Date.now().toString().slice(-9)}`).current;
  const transactionDate = useRef(new Date()).current;

  // Entrance animations
  const checkScale = useRef(new Animated.Value(0)).current;
  const checkOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslate = useRef(new Animated.Value(60)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  // Confetti config (memoized so it doesn't re-randomize on re-render)
  const confettiParticles = useMemo(() => {
    const confettiColors = ['#FF6600', '#4ade80', '#60a5fa', '#f472b6', '#facc15', '#a78bfa'];
    return Array.from({ length: 28 }, (_, i) => ({
      id: i,
      color: confettiColors[i % confettiColors.length],
      x: Math.random() * 340,
      delay: Math.random() * 600,
    }));
  }, []);

  useEffect(() => {
    if (amount && payeeName) {
      reportPayment(amount, payeeName);
    }

    // Check circle pop-in
    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.spring(checkScale, {
          toValue: 1,
          tension: 60,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.timing(checkOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Receipt card slide-up
    Animated.sequence([
      Animated.delay(500),
      Animated.parallel([
        Animated.spring(cardTranslate, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Payment of ₹${amount} to ${payeeName} was successful!\nRef No: ${refNo}\nDate: ${transactionDate.toLocaleString()}`,
      });
    } catch (e) {}
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 16) }]}>

      {/* Confetti */}
      <View style={styles.confettiLayer} pointerEvents="none">
        {confettiParticles.map((p) => (
          <ConfettiParticle key={p.id} color={p.color} x={p.x} delay={p.delay} />
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Check Icon */}
        <Animated.View style={[styles.checkCircleOuter, { transform: [{ scale: checkScale }], opacity: checkOpacity }]}>
          <View style={styles.checkCircleInner}>
            <MaterialIcons name="check" size={52} color="#fff" />
          </View>
        </Animated.View>

        <Text style={styles.title}>Payment Successful!</Text>
        <Text style={styles.subtitle}>Your transfer has been processed securely.</Text>

        {/* Receipt Card */}
        <Animated.View style={[styles.card, { transform: [{ translateY: cardTranslate }], opacity: cardOpacity }]}>

          {/* Top accent bar */}
          <View style={styles.cardAccent} />

          {/* Amount */}
          <View style={styles.amountSection}>
            <Text style={styles.amountLabel}>Amount Paid</Text>
            <Text style={styles.amountValue} adjustsFontSizeToFit numberOfLines={1}>
              ₹ {parseFloat(amount || '0').toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
          </View>

          {/* Dashed divider */}
          <View style={styles.dashedDivider} />

          {/* Details rows */}
          <View style={styles.detailsSection}>
            <DetailRow icon="person" label="Paid To" value={payeeName || 'Unknown Payee'} />
            <DetailRow icon="calendar-today" label="Date & Time" value={formatDate(transactionDate)} />
            <DetailRow icon="receipt-long" label="Reference No." value={refNo} mono />
            <DetailRow icon="lock" label="Security" value="256-bit Encrypted" highlight />
          </View>

          {/* Dashed divider */}
          <View style={styles.dashedDivider} />

          {/* Status badge */}
          <View style={styles.statusRow}>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Completed</Text>
            </View>
            <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
              <MaterialIcons name="share" size={18} color={Colors.primary} />
              <Text style={styles.shareText}>Share</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Footer Actions */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => router.replace('/(app)/home')}>
          <MaterialIcons name="home" size={20} color="#fff" />
          <Text style={styles.primaryBtnText}>Back to Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ghostBtn} onPress={() => router.replace('/(app)/transfer')}>
          <Text style={styles.ghostBtnText}>New Transfer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// --- Detail Row Component ---
function DetailRow({
  icon,
  label,
  value,
  mono = false,
  highlight = false,
}: {
  icon: string;
  label: string;
  value: string;
  mono?: boolean;
  highlight?: boolean;
}) {
  return (
    <View style={detailStyles.row}>
      <View style={detailStyles.labelCol}>
        <MaterialIcons name={icon as any} size={14} color={Colors.onSurfaceVariant} style={{ marginRight: 6 }} />
        <Text style={detailStyles.label}>{label}</Text>
      </View>
      <Text
        style={[
          detailStyles.value,
          mono && detailStyles.mono,
          highlight && detailStyles.highlight,
        ]}
        numberOfLines={2}
      >
        {value}
      </Text>
    </View>
  );
}

const detailStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  labelCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  label: {
    ...Typography.bodySm,
    color: Colors.onSurfaceVariant,
  },
  value: {
    ...Typography.bodyMd,
    fontFamily: 'WorkSans-Medium',
    color: Colors.onSurface,
    flex: 1,
    textAlign: 'right',
    marginLeft: 12,
  },
  mono: {
    fontFamily: 'WorkSans-Medium',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  highlight: {
    color: '#16a34a',
    fontFamily: 'WorkSans-Medium',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  confettiLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 400,
    overflow: 'hidden',
    zIndex: 10,
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: Spacing.marginMobile,
    paddingTop: 64,
    paddingBottom: 24,
  },
  checkCircleOuter: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: '#4ade8033',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.stackLg,
  },
  checkCircleInner: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#16a34a',
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.high,
  },
  title: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.bodySm,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: 32,
  },
  card: {
    backgroundColor: Colors.surfaceContainerLowest,
    width: '100%',
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.outlineVariant + '40',
    overflow: 'hidden',
    ...Shadows.high,
  },
  cardAccent: {
    height: 4,
    backgroundColor: '#16a34a',
  },
  amountSection: {
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 20,
  },
  amountLabel: {
    ...Typography.labelMd,
    color: Colors.onSurfaceVariant,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  amountValue: {
    ...Typography.displayLg,
    color: Colors.primary,
    fontSize: 36,
  },
  dashedDivider: {
    marginHorizontal: 20,
    height: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    marginVertical: 4,
  },
  detailsSection: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: Colors.surfaceContainerLow,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#16a34a',
  },
  statusText: {
    ...Typography.labelMd,
    color: '#16a34a',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryFixed + '80',
  },
  shareText: {
    ...Typography.labelMd,
    color: Colors.primary,
  },
  footer: {
    paddingHorizontal: Spacing.marginMobile,
    paddingTop: 12,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.outlineVariant + '40',
    backgroundColor: Colors.surface,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.DEFAULT,
    height: 52,
  },
  primaryBtnText: {
    ...Typography.bodyMd,
    fontFamily: 'WorkSans-Medium',
    color: '#fff',
  },
  ghostBtn: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostBtnText: {
    ...Typography.labelMd,
    color: Colors.onSurfaceVariant,
    letterSpacing: 0.5,
  },
});
