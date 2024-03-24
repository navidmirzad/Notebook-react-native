import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import axios from "axios";

export default function MyComponent() {
  const API_KEY = "AIzaSyBNX-p8DRubGnM8K3QgtHi_s7ccok5BaIE";
  const url =
    "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=";

  async function login() {
    try {
      const response = await axios.post(url + API_KEY, {
        email: "navidmirzad@hotmail.com",
        password: "navid123",
        returnSecureToken: true,
      });
      alert("Logged in");
    } catch (error) {
      alert("Ikke logget ind, error: " + error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello, React Native!</Text>
      <Button title="Login" onPress={login} style={styles.button} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    fontSize: 20,
  },
});
