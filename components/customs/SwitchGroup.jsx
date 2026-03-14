import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { Switch, View } from '.';

const SwitchGroup = ({title, options, selected, setSelected, side="right"}) => {
  return    <View>
                <Text style={styles.title}>{title}</Text>
                {
                    options.map(options => (
                        <Switch 
                            side={side}
                            key={options.value}
                            label={options.label}
                            boxStyle={selected !== options.value ? styles.boxStyle : {}}
                            isSwitchOn={selected === options.value}
                            onValueChange={() => setSelected(options.value)}
                        />
                    ))
                }
            </View>
};

const styles = StyleSheet.create({
  title:  {
    marginVertical:  8,
    marginLeft: 12,
    fontSize: 16
  },
  boxStyle: {
    marginLeft: 8
  }
})

export default SwitchGroup;