import React from "react";
import { StyleSheet, View, Text, Button, TextInput } from "react-native";
import { useState } from "react";
import axios from "axios";
import { ImageBackground } from "react-native-web";

// ios: 203480973703-qf0ke1lhuijg6vhdg1c9b7vfacma7rup.apps.googleusercontent.com

export default function Authentication({ navigation }) {
  const API_KEY = "AIzaSyBNX-p8DRubGnM8K3QgtHi_s7ccok5BaIE";
  const url =
    "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=";
  const signUpUrl =
    "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=";

  const [newEnteredEmail, setNewEnteredEmail] = useState("");
  const [newEnteredPassword, setNewEnteredPassword] = useState("");
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");

  async function signUp() {
    try {
      const response = await axios.post(signUpUrl + API_KEY, {
        email: newEnteredEmail,
        password: newEnteredPassword,
        returnSecureToken: true,
      });
      alert("Account created succesfully!" + response.data.idToken);
      navigation.navigate("Home", { email: newEnteredEmail });
    } catch (error) {
      alert(
        "Error creating account: " + error.response.data.error.errors[0].message
      );
    }
  }

  async function login() {
    try {
      const response = await axios.post(url + API_KEY, {
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      });
      alert("Logged in" + response.data.idToken);
      navigation.navigate("Home", { email: enteredEmail });
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
              onChangeText={(newText) => setNewEnteredEmail(newText)}
              value={newEnteredEmail}
              style={styles.input}
              placeholder="Enter new email..."
            />
            <TextInput
              onChangeText={(newText) => setNewEnteredPassword(newText)}
              value={newEnteredPassword}
              style={styles.input}
              placeholder="Enter new password..."
            />
            <Button title="REGISTER" onPress={signUp} style={styles.button} />
          </View>
          <View>
            <Text style={styles.text}>Login</Text>
            <TextInput
              onChangeText={(newText) => setEnteredEmail(newText)}
              value={enteredEmail}
              style={styles.input}
              placeholder="Enter Email..."
            />
            <TextInput
              onChangeText={(newText) => setEnteredPassword(newText)}
              value={enteredPassword}
              style={styles.input}
              placeholder="Enter password..."
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
    borderWidth: 1,
    borderColor: "black",
  },
});
