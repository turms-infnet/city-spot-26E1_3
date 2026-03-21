import { View } from "react-native";
import { DatePickerInput } from 'react-native-paper-dates';
import { SafeAreaProvider } from "react-native-safe-area-context";

const DatePicker = (props) => {

  return (
    <SafeAreaProvider>
      <View style={{ justifyContent: 'center', flex: 1, alignItems: 'center' }}>
        <DatePickerInput
            {...props}
        />
      </View>
    </SafeAreaProvider>
  )
}

export default DatePicker;