import {
  forwardRef,
  memo,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  type ElementRef,
} from 'react';
import {
  Platform,
  processColor,
  StyleSheet,
  type TextInputProps,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import TextInputState from 'react-native/Libraries/Components/TextInput/TextInputState';
import ControlledInputViewNativeComponent, {
  type NativeProps,
  type TextChangeEvent,
} from './ControlledInputViewNativeComponent';

export interface ControlledInputViewRef {
  blur: () => void;
  focus: () => void;
}

type ForwardedTextInputProps = Pick<
  TextInputProps,
  | 'autoComplete'
  | 'autoCapitalize'
  | 'keyboardType'
  | 'returnKeyType'
  | 'placeholder'
  | 'placeholderTextColor'
  | 'selectionColor'
  | 'autoCorrect'
>;

export type ControlledInputViewProps = Omit<
  NativeProps,
  'inputStyle' | 'onChangeText' | keyof ForwardedTextInputProps
> &
  ForwardedTextInputProps & {
    onChangeText?: (value: string) => void;
  };

type ControlledInputFocusEvent = Parameters<
  NonNullable<NativeProps['onFocus']>
>[0];
type ControlledInputBlurEvent = Parameters<
  NonNullable<NativeProps['onBlur']>
>[0];
type ControlledInputSubmitEditingEvent = Parameters<
  NonNullable<NativeProps['onSubmitEditing']>
>[0];

// All style props that Android handles via Compose instead of the native View layer
const androidComposeHandledKeys = [
  'color',
  'fontSize',
  'fontFamily',
  'padding',
  'paddingVertical',
  'paddingHorizontal',
  'paddingTop',
  'paddingBottom',
  'paddingLeft',
  'paddingRight',
  'borderWidth',
  'borderRadius',
  'borderColor',
  'backgroundColor',
];

function resolveAndroidComposeViewPadding(flat: Record<string, any>): {
  paddingTop: unknown;
  paddingBottom: unknown;
  paddingLeft: unknown;
  paddingRight: unknown;
} {
  const padding = flat.padding ?? 0;

  return {
    paddingTop: flat.paddingTop ?? flat.paddingVertical ?? padding,
    paddingBottom: flat.paddingBottom ?? flat.paddingVertical ?? padding,
    paddingLeft: flat.paddingLeft ?? flat.paddingHorizontal ?? padding,
    paddingRight: flat.paddingRight ?? flat.paddingHorizontal ?? padding,
  };
}

export const ControlledInputView = memo(
  forwardRef<ControlledInputViewRef, ControlledInputViewProps>(
    (
      {
        style,
        onChangeText,
        onFocus,
        onBlur,
        onSubmitEditing,
        selectionColor,
        placeholderTextColor,
        ...rest
      },
      ref
    ) => {
      const nativeRef =
        useRef<ElementRef<typeof ControlledInputViewNativeComponent>>(null);

      const isNativePlatform =
        Platform.OS === 'ios' || Platform.OS === 'android';

      useLayoutEffect(() => {
        if (!isNativePlatform) {
          return;
        }

        const node = nativeRef.current;

        if (node == null) {
          return;
        }

        TextInputState.registerInput(node);

        return () => {
          TextInputState.unregisterInput(node);

          if (TextInputState.currentlyFocusedInput() === node) {
            TextInputState.blurTextInput(node);
          }
        };
      }, [isNativePlatform]);

      const flattenedStyle = (StyleSheet.flatten(style) ?? {}) as TextStyle;

      let viewStyle: ViewStyle;
      let inputStyle: Record<string, any> | undefined;

      if (Platform.OS === 'android') {
        viewStyle = Object.fromEntries(
          Object.entries(flattenedStyle).filter(
            ([k]) => !androidComposeHandledKeys.includes(k)
          )
        );

        const hasPadding = Object.entries(flattenedStyle).some(
          ([k, v]) => k.includes('padding') && v != null
        );

        inputStyle = {
          color: flattenedStyle.color,
          fontSize: flattenedStyle.fontSize,
          ...(typeof flattenedStyle.height === 'number'
            ? { height: flattenedStyle.height }
            : {}),
          fontFamily: flattenedStyle.fontFamily,
          ...(hasPadding
            ? resolveAndroidComposeViewPadding(flattenedStyle)
            : {}),
          borderWidth: flattenedStyle.borderWidth,
          borderRadius: flattenedStyle.borderRadius,
          borderColor: flattenedStyle.borderColor,
          backgroundColor: flattenedStyle.backgroundColor,
        };
      } else {
        const { color, fontSize, fontFamily, ...iosViewStyle } = flattenedStyle;
        viewStyle = iosViewStyle;

        const hasTextStyle =
          color != null || fontSize != null || fontFamily != null;
        inputStyle = hasTextStyle
          ? {
              color: color != null ? processColor(color) : undefined,
              fontSize,
              fontFamily,
            }
          : undefined;
      }

      const handleTextChange = (e: {
        nativeEvent: Readonly<TextChangeEvent>;
      }): void => {
        if (onChangeText) {
          onChangeText(e.nativeEvent.value);
        }
      };

      const handleFocus = (e: ControlledInputFocusEvent): void => {
        if (isNativePlatform) {
          TextInputState.focusInput(nativeRef.current);
        }
        onFocus?.(e);
      };

      const handleBlur = (e: ControlledInputBlurEvent): void => {
        if (isNativePlatform) {
          TextInputState.blurInput(nativeRef.current);
        }
        onBlur?.(e);
      };

      const handleSubmitEditing = (e: ControlledInputSubmitEditingEvent): void => {
        if (isNativePlatform && nativeRef.current != null) {
          TextInputState.blurTextInput(nativeRef.current);
        }
        onSubmitEditing?.(e);
      };

      useImperativeHandle(ref, () => ({
        blur: () => {
          if (!nativeRef.current || !isNativePlatform) return;
          TextInputState.blurTextInput(nativeRef.current);
        },
        focus: () => {
          if (!nativeRef.current || !isNativePlatform) return;
          TextInputState.focusTextInput(nativeRef.current);
        },
      }));

      return (
        <ControlledInputViewNativeComponent
          {...rest}
          placeholderTextColor={placeholderTextColor}
          selectionColor={selectionColor}
          style={viewStyle}
          inputStyle={inputStyle}
          onChangeText={handleTextChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onSubmitEditing={handleSubmitEditing}
          ref={nativeRef}
        />
      );
    }
  )
);

ControlledInputView.displayName = 'ControlledInputView';

export * from './ControlledInputViewNativeComponent';
