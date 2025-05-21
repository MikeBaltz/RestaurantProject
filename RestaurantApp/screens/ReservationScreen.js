import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function ReservationScreen({ route }) {
  const { restaurant } = route.params;
  const navigation = useNavigation();

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [people, setPeople] = useState('');

  const handleReservation = async () => {
    // Έλεγχος για να δούμε αν τα πεδία είναι σωστά συμπληρωμένα
    if (!date || !time || !people) {
      Alert.alert('Σφάλμα', 'Παρακαλώ συμπληρώστε όλα τα πεδία');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Σφάλμα', 'Πρέπει να είστε συνδεδεμένοι για να κάνετε κράτηση');
        return;
      }

      const response = await fetch('http://192.168.1.26:3000/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          restaurant_id: restaurant.id,
          date,
          time,
          people: parseInt(people),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(
          'Επιτυχής Κράτηση',
          `Η κράτησή σας στο ${restaurant.name} για ${people} άτομα στις ${time} της ${date} πραγματοποιήθηκε με επιτυχία!`,
          [{ text: 'Εντάξει', onPress: () => navigation.goBack() }]
        );
        
      } else {
        Alert.alert('❌ Σφάλμα', data.error || 'Αποτυχία κράτησης');
      }
    } catch (error) {
      console.error('❌ Σφάλμα:', error);
      Alert.alert('❌ Σφάλμα', 'Πρόβλημα σύνδεσης με τον server');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.restaurantName}>{restaurant.name}</Text>
        <Text style={styles.location}>📍 {restaurant.location}</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Εισάγετε ημερομηνία (YYYY-MM-DD)"
          value={date || ''}
          onChangeText={setDate}
          keyboardType="numbers-and-punctuation"
          maxLength={10}
        />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Ώρα</Text>
        <TextInput
          style={styles.input}
          placeholder="Επιλέξτε ώρα"
          value={time}
          onChangeText={setTime}
        />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Αριθμός Ατόμων</Text>
        <TextInput
          style={styles.input}
          placeholder="Πόσα άτομα;"
          keyboardType="numeric"
          value={people}
          onChangeText={setPeople}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleReservation}>
        <Text style={styles.buttonText}>Κάντε Κράτηση</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  restaurantName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  location: {
    fontSize: 16,
    color: '#555',
  },
  formContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});
