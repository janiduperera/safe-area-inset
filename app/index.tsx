import {
  SafeAreaView,
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Pressable,
  Modal,
} from "react-native";
import { useRef, useState } from "react";

type safeAreaInset = {
  top: number;
  left: number;
};

type dataArray = string[];

type popUpPositions = {
  left: number;
  top: number;
};

export default function Index() {
  const chevronDownBlack = require("@/assets/images/chevron-down-black.png");
  const chevronUpBlack = require("@/assets/images/chevron-up-black.png");

  const dropDownRef = useRef<View | null>(null);
  const getInsetPosRef = useRef<View | null>(null);

  // For some reason, if the SafeAreaView does not give the proper insets to calculate the position of a certain element such as button
  // This values will help
  const [safeAreaInsets, setSafeAreaInsets] = useState<safeAreaInset>({
    top: 0,
    left: 0,
  });
  const [popUpPositions, setPopUpPositions] = useState<popUpPositions>({
    left: 0,
    top: 0,
  });

  const [clicked, setClicked] = useState<boolean>(false);
  const [data, setData] = useState<dataArray>([
    "Item 1",
    "Item 2",
    "Item 3",
    "Item 4",
    "Item 5",
    "Item 6",
    "Item 7",
    "Item 8",
    "Item 9",
    "Item 10",
    "Item 11",
  ]);
  const [selectedItem, setSelectedItem] = useState<string>("");

  const onDropDownClicked = (): void => {
    dropDownRef?.current?.measure((x, y, width, height, pagex, pagey) => {
      setPopUpPositions({
        left: pagex - safeAreaInsets.left,
        top: pagey + height - safeAreaInsets.top,
      });
    });

    setClicked(!clicked);
  };

  const dropDownMenu = (
    <View
      style={[
        styles.dropDownMenu,
        styles.shadowProp,
        {
          top: popUpPositions.top,
          left: popUpPositions.left,
        },
      ]}
    >
      <FlatList
        data={data}
        renderItem={({ item }) => {
          return (
            <Pressable
              onPress={() => {
                setSelectedItem(item);
                setClicked(!clicked);
              }}
            >
              <View style={styles.dropDownMenu_Button}>
                <Text style={styles.dropDownMenu_Text}>{item}</Text>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* The whole purpose of this view is to calculae the safe area inset top and left.  */}
      <View
        ref={getInsetPosRef}
        style={{
          position: "absolute",
          width: 0.1,
          height: 0.1,
          left: 0,
          top: 0,
          zIndex: -100,
        }}
        onLayout={(evt) => {
          getInsetPosRef?.current?.measure((pagex, pagey) => {
            setSafeAreaInsets({
              top: pagey,
              left: pagex,
            });
          });
        }}
      />
      <View style={styles.dropDownSection}>
        <Pressable onPress={() => onDropDownClicked()}>
          <View ref={dropDownRef} style={styles.dropDownButton}>
            <Text style={styles.dropDownButton_Text}>
              {selectedItem === "" ? "Select" : selectedItem}
            </Text>
            <View style={styles.dropDownButton_ArrowBox}>
              <Image
                style={styles.dropDownButton_ArrowBox_Chevron}
                source={clicked ? chevronUpBlack : chevronDownBlack}
              ></Image>
            </View>
          </View>
        </Pressable>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={clicked}
        onRequestClose={() => {
          setClicked(!clicked);
        }}
        supportedOrientations={[
          "portrait",
          "portrait-upside-down",
          "landscape",
          "landscape-left",
          "landscape-right",
        ]}
      >
        {dropDownMenu}
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "red",
  },

  dropDownSection: {
    backgroundColor: "white",
    height: 60,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },

  shadowProp: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20, // This should make the shadow work in Andorid
  },

  dropDownButton: {
    width: 242,
    height: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 5,
  },

  dropDownButton_Text: {
    fontFamily: "SpaceMono",
    color: "black",
    fontSize: 15,
  },

  dropDownButton_ArrowBox: {
    width: 32,
    height: 32,
    backgroundColor: "white",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  dropDownButton_ArrowBox_Chevron: {
    width: 18,
    height: 10,
  },

  dropDownMenu: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: "darkgrey",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: "white",
    height: 283,
    width: 242,
  },

  dropDownMenu_Button: {
    width: 242,
    height: 40,
    justifyContent: "center",
  },

  dropDownMenu_Text: {
    fontFamily: "SpaceMono",
    color: "black",
    fontSize: 16,
    marginLeft: 10,
  },
});
