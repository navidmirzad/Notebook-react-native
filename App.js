import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';

export default function App() {
  const [text, setText] = useState("");
  const [notes, setNotes] = useState([]);

  function submit() {
    const newNote = text.trim();
    if (newNote) {
      const timestamp = new Date().toLocaleString(); // Get current timestamp
      const newNoteObject = { content: newNote, timestamp: timestamp };
      setNotes([...notes, newNoteObject]);
      setText('');
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
      <Button title="Submit" onPress={submit} />
      <View style={styles.notesContainer}>
        {notes.map((note, index) => (
          <View key={index} style={styles.noteItem}>
            <Text style={styles.noteContent}>{note.content}</Text>
            <Text style={styles.timestamp}>{note.timestamp}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ADD8E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  largeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  breakLine: {
    height: 20,
  },
  input: {
    width: '80%',
    height: 150,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    textAlign: 'center',
    backgroundColor: 'white'
  },
  notesContainer: {
    width: '80%',
    marginTop: 20,
  },
  noteItem: {
    marginBottom: 10,
    borderBottomWidth: 1,
    paddingBottom: 5,
  },
  noteContent: {
    fontSize: 16,
    marginBottom: 5,
  },
  timestamp: {
    fontSize: 12,
    color: 'gray',
  },
});
