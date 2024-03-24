import React from "react";
import { StyleSheet, View, Text, Button, TextInput } from "react-native";
import { useState } from "react";
import axios from "axios";
import { ImageBackground } from "react-native-web";

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
    <ImageBackground
      source={require("./images/ny.jpg")}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.div}>
          <View>
            <Text style={styles.text}>Register</Text>
            <TextInput
              onChangeText={(newText) => setEnteredEmail(newText)}
              value={enteredEmail}
              style={styles.input}
            />
            <TextInput
              onChangeText={(newText) => setEnteredPassword(newText)}
              value={enteredPassword}
              style={styles.input}
            />
            <Button title="REGISTER" onPress={login} style={styles.button} />
          </View>
          <View>
            <Text style={styles.text}>Login</Text>
            <TextInput
              onChangeText={(newText) => setEnteredEmail(newText)}
              value={enteredEmail}
              style={styles.input}
            />
            <TextInput
              onChangeText={(newText) => setEnteredPassword(newText)}
              value={enteredPassword}
              style={styles.input}
            />
            <Button title="LOGIN" onPress={login} style={styles.button} />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  div: {
    borderWidth: 2,
    borderColor: "gray",
    padding: 60,
    backgroundColor: "white",
  },
  text: {
    textAlign: "center",
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    fontSize: 20,
  },
  input: {
    fontSize: 16,
    flex: 1,
    textAlign: "center",
  },
});
