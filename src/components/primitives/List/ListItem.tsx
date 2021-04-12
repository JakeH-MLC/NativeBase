import React from 'react';
import Box from '../Box';
import type { IListItemProps } from './types';
import { useThemeProps } from '../../../hooks';
import { mergeRefs } from '../../../utils';
import Pressable from '../Pressable';
import { useHover } from '@react-native-aria/interactions';
import { extractInObject } from '../../../theme/tools';

const ListItem = React.memo(
  React.forwardRef(({ children, ...props }: IListItemProps, ref: any) => {
    const {
      index,
      start,
      unordered,
      ul,
      ordered,
      ol,
      _text,
      borderTopWidth,
      _hover,
      ...newProps
    } = useThemeProps('ListItem', props);
    const _ref = React.useRef(null);
    const { isHovered } = useHover({}, _ref);
    // Extracting Pressable Props from newProps
    const [pressableProps, remainingProps] = extractInObject(newProps, [
      'onPress',
      'unstable_pressDelay',
      'android_ripple',
      'android_disableSound',
      'delayLongPress',
      'hitSlop',
      'disabled',
      'onLongPress',
      'onPressIn',
      'onPressOut',
      'pressRetentionOffset',
      'testOnly_pressed',
      'onHoverIn',
      'onHoverOut',
      'onFocus',
      'onBlur',
      '_pressed',
      '_focus',
    ]);

    return Object.keys(pressableProps).length !== 0 ? (
      // Checking if any Pressable Props present
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`List-Item-${index + start}`}
        flexDirection="row"
        alignItems="center"
        {...pressableProps}
        {...remainingProps}
        borderTopWidth={index ? borderTopWidth : 0}
        ref={mergeRefs([ref, _ref])}
        {...(isHovered && _hover)}
      >
        <Box flexDirection="row" alignItems="center" pl={2}>
          {ul || unordered ? ( //Adding disc in front of ListItem
            <Box
              style={{ transform: [{ scale: 1.5 }] }}
              mr={2}
              _text={{ fontWeight: 'bold', ..._text }}
            >
              •
            </Box>
          ) : null}
          {ol || ordered ? ( //Adding index number in front of ListItem
            <Box mr={2} _text={{ fontWeight: 'bold', ..._text }}>
              {index + start + '.'}
            </Box>
          ) : null}
        </Box>
        <Box flexDirection="row" alignItems="center" _text={{ ..._text }}>
          {children}
        </Box>
      </Pressable>
    ) : (
      // If no Pressable Props passed by user render Box instead of Pressable
      <Box
        accessibilityRole="text"
        accessibilityLabel={`List-Item-${index + start}`}
        flexDirection="row"
        alignItems="center"
        {...remainingProps}
        borderTopWidth={index ? borderTopWidth : 0}
        ref={mergeRefs([ref, _ref])}
        {...(isHovered && _hover)}
      >
        <Box flexDirection="row" alignItems="center" pl={2}>
          {ul || unordered ? ( //Adding disc in front of ListItem
            <Box
              style={{ transform: [{ scale: 1.5 }] }}
              mr={2}
              _text={{ fontWeight: 'bold', ..._text }}
            >
              •
            </Box>
          ) : null}
          {ol || ordered ? ( //Adding index number in front of ListItem
            <Box mr={2} _text={{ fontWeight: 'bold', ..._text }}>
              {index + start + '.'}
            </Box>
          ) : null}
        </Box>
        <Box flexDirection="row" alignItems="center" _text={{ ..._text }}>
          {children}
        </Box>
      </Box>
    );
  })
);

export default React.memo(ListItem);
