import {
  codegenNativeComponent,
  type ColorValue,
  type HostComponent,
  type ViewProps,
} from 'react-native';
import { codegenNativeCommands } from 'react-native';
import type {
  BubblingEventHandler,
  Double,
} from 'react-native/Libraries/Types/CodegenTypes';
import type { WithDefault } from 'react-native/Libraries/Types/CodegenTypesNamespace';

export interface TextChangeEvent {
  value: string;
}

export interface FocusEvent {
  // Empty event
}

export interface BlurEvent {
  // Empty event
}

export interface SubmitEditingEvent {
  // Empty event (RN TextInput passes more fields; we keep payload empty)
}

export interface InputStyle {
  color?: ColorValue;
  fontSize?: Double;
  height?: Double;
  fontFamily?: string;
  paddingTop?: Double;
  paddingBottom?: Double;
  paddingLeft?: Double;
  paddingRight?: Double;
  borderWidth?: Double;
  borderRadius?: Double;
  borderColor?: string;
  backgroundColor?: string;
}

export interface NativeProps extends ViewProps {
  value?: string;
  placeholder?: string;
  placeholderTextColor?: ColorValue;
  selectionColor?: ColorValue;
  autoComplete?: string;
  autoCapitalize?: string;
  autoCorrect?: WithDefault<boolean, true>;
  keyboardType?: string;
  returnKeyType?: string;
  inputStyle?: InputStyle;
  onChangeText?: BubblingEventHandler<Readonly<TextChangeEvent>>;
  onFocus?: BubblingEventHandler<Readonly<FocusEvent>>;
  onBlur?: BubblingEventHandler<Readonly<BlurEvent>>;
  onSubmitEditing?: BubblingEventHandler<Readonly<SubmitEditingEvent>>;
}

export interface NativeCommands {
  focus: (viewRef: React.ElementRef<HostComponent<NativeProps>>) => void;
  blur: (viewRef: React.ElementRef<HostComponent<NativeProps>>) => void;
}

export const Commands: NativeCommands = codegenNativeCommands<NativeCommands>({
  supportedCommands: ['focus', 'blur'],
});

export default codegenNativeComponent<NativeProps>('ControlledInputView');