import { app, database } from "./firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { useCollection } from "react-firebase-hooks/firestore";
import * as ImagePicker from "expo-image-picker";
import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function App() {
  const Stack = createNativeStackNavigator();

  const Home = ({ navigation, route }) => {
    const [text, setText] = useState("");
    const [notes, setNotes] = useState([]);
    const [values, loading, error] = useCollection(
      collection(database, "notes")
    );
    const [imagePath, setImagePath] = useState(null);

    // reads notes from firebase
    useEffect(() => {
      if (!loading && values) {
        const retrievedNotes = values.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotes(retrievedNotes);
      }
      getImage();
    }, [loading, values]);

    const submit = async () => {
      const newNote = text.trim();
      const title = text.substring(0, 30);

      if (newNote) {
        const timestamp = new Date().toLocaleString();
        const newNoteObject = {
          IncrementedId: notes.length + 1,
          title: title,
          content: newNote,
          timestamp: timestamp,
          imagePath: imagePath,
        };

        try {
          await addDoc(collection(database, "notes"), newNoteObject);
          console.log("Note added to Firestore:", newNoteObject);
          setNotes([...notes, newNoteObject]);
          setText("");
          await uploadImage(); // Call uploadImage() after the note is submitted
        } catch (error) {
          console.error("Error adding note to Firestore:", error);
        }
      }
    };

    async function updateNote(id, title, content) {
      console.log("Clicked update button");
      navigation.navigate("DetailPage", {
        id: id,
        title: title,
        noteContent: content,
        timestamp: new Date().toLocaleString(),
        updateNote: updateNoteInFirebase, // Pass the updateNoteInFirebase function
      });
    }

    async function updateNoteInFirebase(id, updatedNote) {
      try {
        await updateDoc(doc(database, "notes", id), updatedNote);
        console.log("Note updated in Firebase with id: " + id);
      } catch (error) {
        console.log("Error updating note in Firebase: " + error);
        throw error; // Propagate the error to the caller
      }
    }

    async function deleteNote(id) {
      try {
        await deleteDoc(doc(database, "notes", id));
        console.log("Note deleted from Firebase with id: " + id);
      } catch (error) {
        console.log("Error deleting note from Firebase: " + error);
      }
    }

    async function pickImage() {
      let imagePicked = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
      });
      if (!imagePicked.canceled) {
        setImagePath(imagePicked.assets[0].uri);
      }
    }

    // blob = binary large object
    async function uploadImage() {
      if (!imagePath) {
        console.log("No image to upload");
        return;
      }
      try {
        const res = await fetch(imagePath);
        const blob = await res.blob();
        const storageRef = ref(storage, help + "image.jpg");
        await uploadBytes(storageRef, blob);
        setImagePath("");
        console.log("Image uploaded successfully");
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }

    async function getImage() {
      try {
        getDownloadURL(ref(storage, help + "image.jpg")).then((url) => {
          setImagePath(url);
          console.log("getImage succesful");
        });
      } catch (error) {
        console.log("Couldn't get image from firebase " + error);
      }
    }

    return (
      <View style={styles.container}>
        <Text style={styles.largeText}> Notebook </Text>
        <View style={styles.breakLine} />
        <TextInput
          style={styles.input}
          onChangeText={setText}
          value={text}
          placeholder="Write note..."
          multiline={true}
        />
        <Image
          style={{
            width: 400,
            height: 150,
            margin: 20,
            border: "2px solid black",
          }}
          source={{ uri: imagePath }}
        />
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Button title="Pick Image" onPress={pickImage} />
          <View style={{ marginLeft: 10 }} />
          <Button title="Submit" onPress={submit} />
        </View>
        <View style={styles.notesContainer}>
          {notes.map((note, index) => (
            <View key={index} style={styles.noteItem}>
              <View style={styles.noteContentContainer}>
                <Text style={styles.id}>ID: {note.IncrementedId}</Text>
                <Text>{note.id}</Text>
                <Text style={styles.title}>{note.title}</Text>
                <Text style={styles.noteContent}>{note.content}</Text>
                <Text style={styles.timestamp}>{note.timestamp}</Text>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={() =>
                    updateNote(
                      note.id,
                      note.title,
                      note.content,
                      note.timestamp
                    )
                  }
                >
                  <Text style={styles.updateNote}>Update</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteNote(note.id)}>
                  <Text style={styles.deleteNote}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const DetailPage = ({ navigation, route }) => {
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
        imagePath: imagePath,
      };
      try {
        await uploadImage();
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
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="DetailPage" component={DetailPage} />
      </Stack.Navigator>
    </NavigationContainer>
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
