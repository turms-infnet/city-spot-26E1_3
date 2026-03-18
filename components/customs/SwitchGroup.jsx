import { Colors } from '@/constants/theme';
import { useTheme } from '@/providers/ThemeContext';
import * as React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { Switch, View } from '.';


const SwitchGroup = ({title, options, selected, setSelected, side="right"}) => {
  const { activeTheme } = useTheme();

  return    <View>
                <Text style={{
                        color: Colors[activeTheme].text,
                        ...styles.title
                      }}>{title}</Text>
                {
                    options.map(options => (
                        <Switch 
                            side={side}
                            key={options.value}
                            label={options.label}
                            boxStyle={selected !== options.value ? {
                              marginLeft: Platform.OS === 'ios' ? 0: 8,
                              marginTop: Platform.OS === 'ios' ? 12 : 0
                            } : {
                              marginTop: Platform.OS === 'ios' ? 12 : 0
                            }}
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
  }
})

export default SwitchGroup;