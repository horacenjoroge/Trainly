import React from 'react';
import {
 StyleSheet,
 View,
 Text,
 ScrollView,
 TouchableOpacity,
 Image,
 SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const colors = {
 background: '#120B42',
 primary: '#E57C0B',
 surface: '#1A144B',
 text: '#FFFFFF',
 textSecondary: '#A0A0A0',
};

const TrainingCard = ({ title, duration, level, image, onPress }) => {
 return (
   <TouchableOpacity 
     style={[styles.card, { 
       backgroundColor: colors.surface,
       borderColor: colors.primary,
     }]} 
     onPress={onPress}
   >
     <Image
       source={image}
       style={styles.cardImage}
       resizeMode="cover"
     />
     <View style={styles.cardContent}>
       <Text style={[styles.cardTitle, { color: colors.primary }]}>{title}</Text>
       <View style={styles.cardMeta}>
         <Ionicons name="time-outline" size={16} color={colors.primary} />
         <Text style={[styles.cardMetaText, { color: colors.primary }]}>{duration}</Text>
         <Ionicons name="fitness-outline" size={16} color={colors.primary} />
         <Text style={[styles.cardMetaText, { color: colors.primary }]}>{level}</Text>
       </View>
       <View style={[styles.progressBar, { backgroundColor: `${colors.primary}20` }]}>
         <View style={[styles.progressFill, { 
           width: '70%',
           backgroundColor: colors.primary 
         }]} />
       </View>
     </View>
   </TouchableOpacity>
 );
};

const StatCard = ({ icon, value, label }) => {
 return (
   <View style={styles.statCard}>
     <Ionicons name={icon} size={24} color={colors.primary} />
     <Text style={[styles.statNumber, { color: colors.primary }]}>{value}</Text>
     <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
   </View>
 );
};

const HomeScreen = ({ navigation }) => {  
 const handleTrainingPress = () => {
   navigation.navigate('Training');
 };

 return (
   <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
     <ScrollView>
       <View style={[styles.header, { backgroundColor: colors.primary }]}>
         <Text style={[styles.greeting, { color: colors.text }]}>Welcome back, Horace!</Text>
         <Text style={[styles.subtitle, { color: colors.background }]}>Ready for today's training?</Text>
         <TouchableOpacity 
           style={[styles.orangeButton, { backgroundColor: colors.surface }]}
           onPress={() => navigation.navigate('TrainingSelection')}
         >
           <Text style={[styles.buttonText, { color: colors.primary }]}>Start New Training</Text>
         </TouchableOpacity>
       </View>

       <View style={[styles.statsContainer, { backgroundColor: colors.surface }]}>
         <StatCard icon="trophy-outline" value="12" label="Workouts" />
         <StatCard icon="time-outline" value="5.2" label="Hours" />
         <StatCard icon="flame-outline" value="324" label="Calories" />
       </View>

       <View style={[styles.section, { backgroundColor: colors.surface }]}>
         <Text style={[styles.sectionTitle, { color: colors.primary }]}>Featured Workouts</Text>
         <ScrollView horizontal showsHorizontalScrollIndicator={false}>
           <TrainingCard
             title="Full Body Strength"
             duration="45 min"
             level="Intermediate"
             image={require('../assets/images/gym1.jpg')}
             onPress={handleTrainingPress}
           />
           <TrainingCard
             title="HIIT Cardio"
             duration="30 min"
             level="Advanced"
             image={require('../assets/images/bike.jpg')}
             onPress={handleTrainingPress}
           />
           <TrainingCard
             title="Swimming Drills"
             duration="60 min"
             level="Beginner"
             image={require('../assets/images/pool.jpg')}
             onPress={handleTrainingPress}
           />
         </ScrollView>
       </View>

       <View style={[styles.section, { backgroundColor: colors.surface }]}>
         <Text style={[styles.sectionTitle, { color: colors.primary }]}>Recent Activities</Text>
         <TrainingCard
           title="Morning Run"
           duration="35 min"
           level="5 km"
           image={require('../assets/images/run.jpg')}
           onPress={handleTrainingPress}
         />
         <TrainingCard
           title="Cycling Session"
           duration="90 min"
           level="20 km"
           image={require('../assets/images/bike.jpg')}
           onPress={handleTrainingPress}
         />
       </View>
     </ScrollView>
   </SafeAreaView>
 );
};

const styles = StyleSheet.create({
 container: {
   flex: 1,
 },
 header: {
   padding: 20,
   borderBottomLeftRadius: 20,
   borderBottomRightRadius: 20,
 },
 greeting: {
   fontSize: 24,
   fontWeight: 'bold',
 },
 subtitle: {
   fontSize: 16,
   marginTop: 5,
   fontWeight: '500',
 },
 statsContainer: {
   flexDirection: 'row',
   justifyContent: 'space-around',
   padding: 20,
   margin: 16,
   borderRadius: 16,
   borderWidth: 1,
   borderColor: `${colors.primary}20`,
 },
 statCard: {
   alignItems: 'center',
 },
 statNumber: {
   fontSize: 20,
   fontWeight: 'bold',
   marginTop: 5,
 },
 statLabel: {
   fontSize: 12,
   marginTop: 2,
 },
 section: {
   padding: 16,
   margin: 16,
   borderRadius: 16,
 },
 sectionTitle: {
   fontSize: 18,
   fontWeight: 'bold',
   marginBottom: 15,
 },
 card: {
   width: 280,
   borderRadius: 15,
   marginRight: 15,
   borderWidth: 1,
   elevation: 3,
   shadowColor: colors.primary,
   shadowOffset: { width: 0, height: 4 },
   shadowOpacity: 0.2,
   shadowRadius: 6,
 },
 cardImage: {
   width: '100%',
   height: 150,
   borderTopLeftRadius: 15,
   borderTopRightRadius: 15,
 },
 cardContent: {
   padding: 15,
 },
 cardTitle: {
   fontSize: 16,
   fontWeight: 'bold',
 },
 cardMeta: {
   flexDirection: 'row',
   alignItems: 'center',
   marginTop: 8,
 },
 cardMetaText: {
   fontSize: 14,
   marginLeft: 4,
   marginRight: 12,
 },
 orangeButton: {
   padding: 14,
   borderRadius: 12,
   alignItems: 'center',
   marginTop: 15,
   borderWidth: 1,
   borderColor: colors.primary,
 },
 buttonText: {
   fontWeight: 'bold',
   fontSize: 16,
 },
 progressBar: {
   height: 4,
   borderRadius: 2,
   marginTop: 12,
 },
 progressFill: {
   height: '100%',
   borderRadius: 2,
 },
});

export default HomeScreen;