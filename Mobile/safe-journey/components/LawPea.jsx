import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Image,
  ActivityIndicator,
} from "react-native";
import { Link } from "expo-router";
import firestore from "@react-native-firebase/firestore";

const LawCon = () => {
  const [laws, setLaws] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLaws = async () => {
      try {
        const querySnapshot = await firestore()
          .collection("laws")
          .where("category", "==", "peatones")
          .get();

        const fetchedLaws = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setLaws(fetchedLaws);
      } catch (error) {
        console.error("Error fetching signals: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLaws();
  }, []);

  const renderItem = ({ item }) => (
    <Link asChild href={`/lawDet/${item.id}`} key={item.id}>
      <Pressable style={styles.row}>
        <Text style={styles.text}>{item.name}</Text>
      </Pressable>
    </Link>
  );

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leyes para peatones</Text>
      <Image
        source={require("../assets/peatones.png")}
        style={styles.image}
      />
      <View style={styles.list}>
        <FlatList
          data={laws}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
      <Link asChild href="/lawx">
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>REGRESAR</Text>
        </Pressable>
      </Link>
    </View>
  );
};

export default LawCon;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F9FC",
    alignItems: "center",
    paddingTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 150,
    marginBottom: 20,
  },
  list: {
    height: "50%",
  },
  row: {
    borderWidth: 1,
    borderColor: "#000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "90%",
    backgroundColor: "#FFFFFF",
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
  },
  button: {
    backgroundColor: "#7BDFF2",
    borderRadius: 30,
    marginTop: 20,
    width: 200,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
