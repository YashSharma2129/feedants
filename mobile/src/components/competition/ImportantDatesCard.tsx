import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { Competition } from '../../types/competition';

interface ImportantDatesCardProps {
  competition: Competition;
}

export const ImportantDatesCard: React.FC<ImportantDatesCardProps> = ({
  competition,
}) => {
  const formatDateParts = (dateString?: string, fallbackDate?: string, fallbackTime?: string) => {
    if (!dateString) {
      return { date: fallbackDate || '10 Aug 26', time: fallbackTime || '11:50 PM' };
    }
    try {
      const d = new Date(dateString);
      const day = d.getDate();
      const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec',
      ];
      const month = monthNames[d.getMonth()];
      const year = String(d.getFullYear()).slice(-2);
      
      let hours = d.getHours();
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      const formattedTime = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;

      return {
        date: `${day} ${month} ${year}`,
        time: formattedTime,
      };
    } catch {
      return { date: fallbackDate || '10 Aug 26', time: fallbackTime || '11:50 PM' };
    }
  };

  const regEnd = formatDateParts(competition.registrationEndAt, '10 Aug 26', '11:50 PM');
  const subStart = formatDateParts(competition.submissionStartAt, '6 Aug 26', '04:00 AM');
  const subEnd = formatDateParts(competition.submissionEndAt, '30 Aug 26', '11:55 PM');
  const resDate = formatDateParts(competition.resultDate, '1 Sept 26', '11:50 PM');

  return (
    <View style={styles.wrapper}>
      <Text style={styles.sectionHeader}>Important Dates</Text>

      <View style={styles.cardContainer}>
        {/* Top Row */}
        <View style={styles.row}>
          {/* Top Left: Register Before */}
          <View style={styles.cell}>
            <View style={styles.iconWrapper}>
              <Ionicons name="calendar-outline" size={20} color="#0D9488" />
            </View>
            <View style={styles.textWrapper}>
              <Text style={styles.cellLabel}>Register Before</Text>
              <Text style={styles.cellDate}>{regEnd.date}</Text>
              <Text style={styles.cellTime}>{regEnd.time}</Text>
            </View>
          </View>

          <View style={styles.verticalDivider} />

          {/* Top Right: Submission Starts */}
          <View style={styles.cell}>
            <View style={styles.iconWrapper}>
              <Feather name="send" size={20} color="#0D9488" />
            </View>
            <View style={styles.textWrapper}>
              <Text style={styles.cellLabel}>Submission Starts</Text>
              <Text style={styles.cellDate}>{subStart.date}</Text>
              <Text style={styles.cellTime}>{subStart.time}</Text>
            </View>
          </View>
        </View>

        <View style={styles.horizontalDivider} />

        {/* Bottom Row */}
        <View style={styles.row}>
          {/* Bottom Left: Submission Ends */}
          <View style={styles.cell}>
            <View style={styles.iconWrapper}>
              <Feather name="upload" size={20} color="#0D9488" />
            </View>
            <View style={styles.textWrapper}>
              <Text style={styles.cellLabel}>Submission Ends</Text>
              <Text style={styles.cellDate}>{subEnd.date}</Text>
              <Text style={styles.cellTime}>{subEnd.time}</Text>
            </View>
          </View>

          <View style={styles.verticalDivider} />

          {/* Bottom Right: Result Date */}
          <View style={styles.cell}>
            <View style={styles.iconWrapper}>
              <Ionicons name="trophy-outline" size={20} color="#0D9488" />
            </View>
            <View style={styles.textWrapper}>
              <Text style={styles.cellLabel}>Result Date</Text>
              <Text style={styles.cellDate}>{resDate.date}</Text>
              <Text style={styles.cellTime}>{resDate.time}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 18,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    gap: 12,
  },
  iconWrapper: {
    marginTop: 2,
  },
  textWrapper: {
    flex: 1,
  },
  cellLabel: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 3,
    fontWeight: '500',
  },
  cellDate: {
    fontSize: 13,
    fontWeight: '800',
    color: '#008080',
    lineHeight: 18,
  },
  cellTime: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 16,
  },
  verticalDivider: {
    width: 1,
    backgroundColor: '#F1F5F9',
  },
  horizontalDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
});
