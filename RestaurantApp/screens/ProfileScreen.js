import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function ProfileScreen() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [newTime, setNewTime] = useState('');
  const [newPeople, setNewPeople] = useState('');

  const API_URL = 'http://localhost:3000'; // ⚠️ άλλαξε το αν είναι Android Emulator

  // 🔄 Φόρτωση κρατήσεων
  const fetchReservations = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(`${API_URL}/my-reservations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReservations(res.data);
    } catch (err) {
      console.error('❌ Σφάλμα φόρτωσης:', err);
      Alert.alert('Σφάλμα', 'Αποτυχία φόρτωσης κρατήσεων');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  // ✏️ Επεξεργασία κράτησης
  const handleEdit = (reservation) => {
    setSelectedReservation(reservation);
    setNewTime(reservation.time);
    setNewPeople(String(reservation.people));
    setEditModalVisible(true);
  };

  // 💾 Αποθήκευση αλλαγών
  const handleSave = async () => {
    if (!newTime || !newPeople) {
      Alert.alert('Σφάλμα', 'Συμπληρώστε όλα τα πεδία');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put(
        `${API_URL}/update-reservation/${selectedReservation.id}`,
        { time: newTime, people: parseInt(newPeople) },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setEditModalVisible(false);
      fetchReservations();
    } catch (err) {
      console.error('❌ Σφάλμα αποθήκευσης:', err);
      Alert.alert('Σφάλμα', 'Αποτυχία αποθήκευσης αλλαγών');
    }
  };

  // 🗑️ Διαγραφή κράτησης
  const handleDelete = async (id) => {
    Alert.alert('Επιβεβαίωση', 'Θέλετε να διαγράψετε αυτή την κράτηση;', [
      { text: 'Ακύρωση', style: 'cancel' },
      {
        text: 'Διαγραφή',
        style: 'destructive',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('token');
            await axios.delete(`${API_URL}/delete-reservation/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            fetchReservations();
          } catch (err) {
            console.error('❌ Σφάλμα διαγραφής:', err);
            Alert.alert('Σφάλμα', 'Αποτυχία διαγραφής κράτησης');
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.restaurantName}>{item.restaurant_name}</Text>
      <Text style={styles.detail}>
  📅 {new Date(item.date).toLocaleDateString('el-GR')}</Text>
      <Text style={styles.detail}>🕒 {item.time}</Text>
      <Text style={styles.detail}>👥 {item.people} άτομα</Text>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
          <Text style={styles.buttonText}>Επεξεργασία</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
          <Text style={styles.buttonText}>Διαγραφή</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#555" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={reservations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>Δεν υπάρχουν κρατήσεις</Text>}
      />

      {/* ✏️ Modal επεξεργασίας */}
      <Modal visible={editModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Επεξεργασία Κράτησης</Text>

            <TextInput
              style={styles.input}
              placeholder="Νέα Ώρα"
              value={newTime}
              onChangeText={setNewTime}
            />
            <TextInput
              style={styles.input}
              placeholder="Αριθμός Ατόμων"
              keyboardType="numeric"
              value={newPeople}
              onChangeText={setNewPeople}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.buttonText}>Αποθήκευση</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.buttonText}>Ακύρωση</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  detail: {
    fontSize: 15,
    color: '#555',
    marginVertical: 2,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: '#999',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
  },
  cancelButton: {
    backgroundColor: '#999',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
  },
});
