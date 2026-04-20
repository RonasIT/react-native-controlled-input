import {
  ControlledInputView,
  type ControlledInputViewRef,
} from '@ronas-it/react-native-controlled-input';
import { useRef, useState, type ReactElement } from 'react';
import { StyleSheet, ScrollView, Button, View } from 'react-native';

const formatPromoCode = (input: string): string => {
  let letters = '';
  let digits = '';

  for (const ch of input.toUpperCase()) {
    if (/[A-Z]/.test(ch) && letters.length < 4) {
      letters += ch;
    } else if (/[0-9]/.test(ch) && letters.length === 4 && digits.length < 4) {
      digits += ch;
    }
  }

  if (!digits.length) {
    return letters;
  }

  return `${letters}-${digits}`;
};

const formatExpiry = (input: string): string => {
  const raw = input.replace(/\D/g, '');
  let digits = '';

  for (let i = 0; i < raw.length && digits.length < 4; i++) {
    const next = digits + raw[i];

    if (next.length <= 2) {
      const m = next;

      if (m.length === 1) {
        if (m !== '0' && m !== '1') {
          continue;
        }
      } else if (Number(m) < 1 || Number(m) > 12) {
        continue;
      }
    }

    digits = next;
  }

  if (!digits.length) {
    return '';
  }

  const month = digits.slice(0, 2);
  const year = digits.slice(2, 4);

  return year ? `${month}/${year}` : month;
};

const formatPhone = (input: string): string => {
  const digits = input.replace(/\D/g, '').slice(0, 11);

  if (!digits.length) {
    return input.includes('+') ? '+' : '';
  }

  let result = `+${digits[0]}`;

  if (digits.length > 1) result += ` (${digits.slice(1, 4)}`;
  if (digits.length >= 4) result += ')';
  if (digits.length > 4) result += ` ${digits.slice(4, 7)}`;
  if (digits.length > 7) result += `-${digits.slice(7, 9)}`;
  if (digits.length > 9) result += `-${digits.slice(9, 11)}`;

  return result;
};

export default function App(): ReactElement {
  const [value, setValue] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [expiry, setExpiry] = useState('');
  const [phone, setPhone] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<ControlledInputViewRef>(null);

  const handleValueChange = (text: string): void => {
    setValue(text.replace(/\d/g, ''));
  };

  const handleFocus = (): void => {
    setIsFocused(true);
  };

  const handleBlur = (): void => {
    setIsFocused(false);
  };

  const focus = (): void => {
    inputRef.current?.focus();
  };

  const blur = (): void => {
    inputRef.current?.blur();
  };

  const handlePhoneChange = (text: string): void => {
    setPhone((prev) => {
      const prevDigits = prev.replace(/\D/g, '');
      const nextDigits = text.replace(/\D/g, '');

      if (text.length < prev.length && nextDigits === prevDigits && prevDigits.length > 0) {
        return formatPhone(prevDigits.slice(0, -1));
      }

      return formatPhone(text);
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps='handled'
    >
      <ControlledInputView
        value={value}
        ref={inputRef}
        placeholder='Type something...'
        onChangeText={handleValueChange}
        style={[styles.input, isFocused && styles.focusedInput]}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <Button title='Focus' onPress={focus} />
      <Button title='Blur' onPress={blur} />

      <View style={styles.formatSection}>
        <ControlledInputView
          value={promoCode}
          placeholder='Promo / invite code (ABCD-1234)'
          onChangeText={(text) => setPromoCode(formatPromoCode(text))}
          style={styles.input}
          placeholderTextColor='#666666'
        />
        <ControlledInputView
          value={expiry}
          placeholder='Card expiry (MM/YY)'
          keyboardType='number-pad'
          placeholderTextColor='#666666'
          onChangeText={(text) => setExpiry(formatExpiry(text))}
          style={styles.input}
        />
        <ControlledInputView
          value={phone}
          placeholder='+1 (___) ___-__-__'
          keyboardType='phone-pad'
          placeholderTextColor='#666666'
          onChangeText={handlePhoneChange}
          style={styles.input}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
  },
  content: {
    marginTop: 100,
    flex: 1,
    gap: 20,
  },
  input: {
    height: 48,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#F7F8FA',
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#F7F8FA',
    paddingHorizontal: 10,
    color: '#000000',
    fontFamily: 'AlbertSans-Regular',
  },
  focusedInput: {
    borderColor: '#167BF1',
  },
  formatSection: {
    gap: 12,
  },
});
