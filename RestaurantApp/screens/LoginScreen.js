import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login');

  const handleSubmit = async () => {
    const endpoint = mode === 'login'
      ? 'http://localhost/login'
      : 'http://localhost:3000/register';
  
    const payload =
      mode === 'login'
        ? { email, password }
        : { name, email, password };
  
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        if (mode === 'login') {
          await AsyncStorage.setItem('token', data.token);
          navigation.navigate('Restaurants');
        }
        alert(`✅ Επιτυχία: ${mode === 'login' ? 'Σύνδεση' : 'Εγγραφή'}`);
      } else {
        alert(`❌ Σφάλμα: ${data.error}`);
      }
    } catch (error) {
      console.error('Σφάλμα:', error);
      alert('❌ Σφάλμα σύνδεσης με τον server');
    }
  };
  

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.card}>
        <Text style={styles.title}>{mode === 'login' ? 'Καλώς ήρθες!' : 'Δημιουργία Λογαριασμού'}</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          placeholderTextColor="#999"
        />

{mode === 'register' && (
  <TextInput
    style={styles.input}
    placeholder="Όνομα"
    value={name}
    onChangeText={setName}
    placeholderTextColor="#999"
  />
)}

        <TextInput
          style={styles.input}
          placeholder="Κωδικός"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#999"
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>
            {mode === 'login' ? 'Σύνδεση' : 'Εγγραφή'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setMode(mode === 'login' ? 'register' : 'login')}>
          <Text style={styles.toggle}>
            {mode === 'login'
              ? 'Δεν έχεις λογαριασμό; Κάνε εγγραφή.'
              : 'Έχεις ήδη λογαριασμό; Σύνδεση.'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef2f3',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
    color: '#333',
  },
  input: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    fontSize: 16,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  toggle: {
    marginTop: 20,
    textAlign: 'center',
    color: '#2196F3',
    fontWeight: '500',
  },
});
