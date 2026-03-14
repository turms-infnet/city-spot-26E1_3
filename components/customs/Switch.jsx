import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Switch as RnpSwitch, Text } from 'react-native-paper';
import { View } from '.';

const Switch = ({isSwitchOn, onValueChange, label=null, side="right", boxStyle={}}) => {

  return <View style={{
                ...styles.container
              }}>
            { side === "left" && label !== null  ? <View style={styles.boxTitle}>
               <Text onPress={onValueChange}>{label}</Text> 
            </View> : null }
            <View style={styles.boxSwitch}>
              <RnpSwitch style={boxStyle} value={isSwitchOn} onValueChange={onValueChange} />;
            </View>
            { side === "right" && label !== null ? <Text onPress={onValueChange}>{label}</Text> : null }
        </View>
};

const styles = StyleSheet.create({
  container:  {
    flexDirection: "row",
    alignItems: "center",
  },
  boxSwitch: {
    alignItems: 'flex-start',
    width: 60,
  },
  boxTitle: {
    alignItems: 'flex-start',
    minWidth: 60,
    marginLeft: 14
  },
})

export default Switch;