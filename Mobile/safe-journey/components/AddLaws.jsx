import React, { useState } from "react";
import { View, TextInput, Button, Alert, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import firestore from "@react-native-firebase/firestore";

const AddLaws = () => {
  const [newLaw, setNewLaw] = useState({
    name: "",
    description: "",
    category: "",
  });

  const handleInputChange = (field, value) => {
    setNewLaw({ ...newLaw, [field]: value });
  };

  const onSend = async () => {
    try {
      const { name, description, category } = newLaw;

      if (!name || !description || !category) {
        Alert.alert("Error", "Todos los campos son obligatorios");
        return;
      }

      const docRef = await firestore().collection("laws").add(newLaw);
      console.log("Document written with ID: ", docRef.id);
      Alert.alert("Éxito", "Ley agregada correctamente");

      setNewLaw({
        name: "",
        description: "",
        category: "",
      });
    } catch (error) {
      console.error("Error adding document: ", error);
      Alert.alert("Error", `No se pudo agregar la ley: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Nombre de la ley"
        value={newLaw.name}
        onChangeText={(value) => handleInputChange("name", value)}
        style={styles.input}
      />
      <TextInput
        placeholder="Descripción de la ley"
        value={newLaw.description}
        onChangeText={(value) => handleInputChange("description", value)}
        style={styles.input}
      />
      <Picker
        selectedValue={newLaw.category}
        onValueChange={(value) => handleInputChange("category", value)}
        style={styles.picker}
      >
        <Picker.Item label="Seleccione una categoría" value="" />
        <Picker.Item label="Conductores" value="conductores" />
        <Picker.Item label="Peatones" value="peatones" />
        <Picker.Item label="Ciclistas" value="ciclistas" />
      </Picker>
      <Button title="Agregar Ley" onPress={onSend} />
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

export default AddLaws;
