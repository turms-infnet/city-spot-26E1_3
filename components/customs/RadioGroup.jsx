import * as React from 'react';
import { View } from 'react-native';
import { RadioButton, Text } from 'react-native-paper';

const RadioGroup = (props) => {

  return (
    <View>
      {
        props.options.map((option, index) => (
            <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <RadioButton
                    value={option.value}
                    status={ props.currentValue === option.value ? 'checked' : 'unchecked' }
                    onPress={() => props.onValueChange(option.value)}
                />
                <Text onPress={() => props.onValueChange(option.value)}>{option.label}</Text>
            </View>
        ))
      }
    </View>
  );
};

export default RadioGroup;