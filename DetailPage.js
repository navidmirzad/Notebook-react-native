import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, TextInput, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function DetailPage({ navigation, route }) {
  const { id, title, noteContent, timestamp, updateNote } = route.params;
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedContent, setEditedContent] = useState(noteContent);
  const [imagePath, setImagePath] = useState(null);

  useEffect(() => {
    getImage();
  }, []);

  const saveNote = async () => {
    const updatedNote = {
      title: editedTitle,
      content: editedContent,
      timestamp: timestamp,
      imagePath: "",
    };
    try {
      await uploadImage(id);
      await updateNote(id, updatedNote); // Call the updateNote function passed from the Home scwreen to update the note in Firebase
      navigation.goBack(); // Go back to the Home screen after saving the note
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };
  async function pickImage() {
    let imagePicked = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
    });
    if (!imagePicked.canceled) {
      setImagePath(imagePicked.assets[0].uri);
    }
  }

  async function uploadImage(noteId) {
    if (!imagePath) {
      console.log("No image to upload");
      return;
    }
    try {
      const res = await fetch(imagePath);
      const blob = await res.blob();
      const storageRef = ref(storage, `${noteId}_image.jpg`);
      await uploadBytes(storageRef, blob);
      setImagePath("");
      console.log("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  }

  async function getImage() {
    try {
      getDownloadURL(ref(storage, `${id}_image.jpg`)).then((url) => {
        setImagePath(url);
        console.log("getImage successful");
      });
    } catch (error) {
      console.log("Couldn't get image from firebase " + error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.largeText}> Detail Page </Text>
      <Text>{title}</Text>
      <View style={styles.breakLine} />
      <TextInput
        style={styles.input}
        onChangeText={setEditedContent}
        placeholder={editedContent}
        multiline={true}
      />
      <Image
        style={{
          width: 400,
          height: 200,
          margin: 10,
          marginBottom: 20,
          border: "2px solid black",
        }}
        source={{ uri: imagePath }}
      />
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Button title="Pick Image" onPress={pickImage} />
        <View style={{ marginLeft: 10 }} />
        <Button title="Update" onPress={saveNote} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ADD8E6",
    alignItems: "center",
    justifyContent: "center",
  },
  largeText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  breakLine: {
    height: 20,
  },
  input: {
    width: "80%",
    height: 150,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    textAlign: "center",
    backgroundColor: "white",
  },
  notesContainer: {
    width: "60%",
    marginTop: 20,
  },
  noteItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    borderBottomWidth: 1,
    paddingBottom: 5,
  },
  noteContentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    marginBottom: 5,
  },
  noteContent: {
    fontSize: 12,
    marginBottom: 5,
  },
  timestamp: {
    fontSize: 12,
    color: "gray",
  },
  updateNote: {
    padding: 8,
    backgroundColor: "green",
    borderRadius: 5,
    fontSize: 15,
    margin: 5,
  },
  deleteNote: {
    padding: 8,
    backgroundColor: "red",
    borderRadius: 5,
    fontSize: 15,
    margin: 5,
  },
  buttonContainer: {
    flexDirection: "row",
  },
});
