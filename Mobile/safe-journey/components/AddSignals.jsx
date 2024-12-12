import React, { useState } from "react";
import { View, TextInput, Button, Alert, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import firestore from "@react-native-firebase/firestore";

const AddSignals = () => {
  const [newSign, setNewSign] = useState({
    name: "",
    description: "",
    imageUrl: "",
    category: "",
  });

  const handleInputChange = (field, value) => {
    setNewSign({ ...newSign, [field]: value });
  };

  const onSend = async () => {
    try {
      const { name, description, imageUrl, category } = newSign;

      if (!name || !description || !imageUrl || !category) {
        Alert.alert("Error", "Todos los campos son obligatorios");
        return;
      }

      const docRef = await firestore().collection("signals").add(newSign);
      console.log("Document written with ID: ", docRef.id);
      Alert.alert("Éxito", "Señal agregada correctamente");

      setNewSign({
        name: "",
        description: "",
        imageUrl: "",
        category: "",
      });
    } catch (error) {
      console.error("Error adding document: ", error);
      Alert.alert("Error", `No se pudo agregar la señal: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Nombre de la señal"
        value={newSign.name}
        onChangeText={(value) => handleInputChange("name", value)}
        style={styles.input}
      />
      <TextInput
        placeholder="Descripción de la señal"
        value={newSign.description}
        onChangeText={(value) => handleInputChange("description", value)}
        style={styles.input}
      />
      <TextInput
        placeholder="URL de la imagen"
        value={newSign.imageUrl}
        onChangeText={(value) => handleInputChange("imageUrl", value)}
        style={styles.input}
      />
      <Picker
        selectedValue={newSign.category}
        onValueChange={(value) => handleInputChange("category", value)}
        style={styles.picker}
      >
        <Picker.Item label="Seleccione una categoría" value="" />
        <Picker.Item label="Conductores" value="conductores" />
        <Picker.Item label="Peatones" value="peatones" />
        <Picker.Item label="Ciclistas" value="ciclistas" />
      </Picker>
      <Button title="Agregar Señal" onPress={onSend} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginVertical: 10,
    padding: 5,
  },
});

export default AddSignals;