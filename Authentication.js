import React from "react";
import { StyleSheet, View, Text, Button, TextInput } from "react-native";
import { useState } from "react";
import axios from "axios";

export default function MyComponent() {
  const API_KEY = "AIzaSyBNX-p8DRubGnM8K3QgtHi_s7ccok5BaIE";
  const url =
    "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=";
  const [enteredEmail, setEnteredEmail] = useState("navidmirzad@hotmail.com");
  const [enteredPassword, setEnteredPassword] = useState("navid123");

  async function login() {
    try {
      const response = await axios.post(url + API_KEY, {
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      });
      alert("Logged in" + response.data.idToken);
    } catch (error) {
      alert(
        "Ikke logget ind, error: " + error.response.data.error.errors[0].message
      );
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello, React Native!</Text>
      <TextInput
        onChangeText={(newText) => setEnteredEmail(newText)}
        value={enteredEmail}
      />
      <TextInput
        onChangeText={(newText) => setEnteredPassword(newText)}
        value={enteredPassword}
      />
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
