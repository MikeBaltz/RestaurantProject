import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RestaurantsScreen() {
  const [restaurants, setRestaurants] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{ marginRight: 15 }}
          onPress={() => navigation.navigate('Profile')}
        >
          <Icon name="person-circle-outline" size={26} color="#2196F3" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);


  const fetchRestaurants = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch('http://192.168.1.26:3000/restaurants', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setRestaurants(data);
      setFiltered(data);
    } catch (error) {
      console.error('❌ Σφάλμα:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    const filteredData = restaurants.filter((r) =>
      r.name.toLowerCase().includes(text.toLowerCase()) ||
      r.location.toLowerCase().includes(text.toLowerCase())
    );
    setFiltered(filteredData);
  };

  const handleReserve = (restaurant) => {
    navigation.navigate('Reservation', { restaurant });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>🍽️ Εστιατόρια</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Αναζήτηση εστιατορίου ή τοποθεσίας..."
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.location}>📍 {item.location}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.price}>💰 Από {item.price_per_person ? `${item.price_per_person} €` : 'Δεν διατίθεται'}/ άτομο</Text>
            <TouchableOpacity
            style={styles.button}
            onPress={() => handleReserve(item)}
            >
            <Text style={styles.buttonText}>Κράτηση</Text>
            </TouchableOpacity>
          </View>
  )}
  ListEmptyComponent={<Text style={styles.empty}>Δεν υπάρχουν εστιατόρια.</Text>}
  keyboardShouldPersistTaps="handled"
  contentContainerStyle={{ paddingBottom: 20 }}
/>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#fff' },
  header: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 15 },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#fdfdfd',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  name: { fontSize: 16, fontWeight: 'bold', marginBottom: 3 },
  location: { fontSize: 13, color: '#555', marginBottom: 3 },
  description: { fontSize: 13, color: '#333', marginBottom: 6 },
  price: { fontSize: 13, color: '#2e7d32', marginBottom: 6 },
  category: { fontSize: 13, fontStyle: 'italic', marginBottom: 3 },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 13 },
  
  empty: { textAlign: 'center', marginTop: 30 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
