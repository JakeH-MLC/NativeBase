import React, { memo, forwardRef } from 'react';
import { Modal } from '../../composites/Modal';
import type { IActionsheetContentProps } from './types';
import { usePropsResolution } from '../../../hooks';
import { Animated, PanResponder } from 'react-native';
import { ModalContext } from '../Modal/Context';
import Box from '../../primitives/Box';
import { ActionSheetContext } from './ActionSheetContext';
import { useHasResponsiveProps } from '../../../hooks/useHasResponsiveProps';

const Content = memo(
  forwardRef(
    (
      {
        hideDragIndicator,
        children,
        handleClose,
        pan,
        sheetHeight,
        ...props
      }: any,
      ref: any
    ) => {
      const {
        _dragIndicator,
        _dragIndicatorWrapperOffSet,
        _dragIndicatorWrapper,
        ...resolvedProps
      } = usePropsResolution('ActionsheetContent', props);

      const handleCloseRef = React.useRef(null);
      const handleCloseCallback = React.useCallback(() => {
        let handleCloseCurrent = handleCloseRef.current;
        //@ts-ignore
        return handleCloseCurrent();
      }, []);
      React.useEffect(() => {
        handleCloseRef.current = handleClose;
      }, [handleClose]);

      const panResponder = React.useRef(
        PanResponder.create({
          onStartShouldSetPanResponder: () => true,
          onMoveShouldSetPanResponder: (_evt, gestureState) => {
            return gestureState.dy > 15;
          },
          onPanResponderMove: (e, gestureState) => {
            if (gestureState.dy > 0) {
              Animated.event([null, { dy: pan.y }], {
                useNativeDriver: false,
              })(e, gestureState);
            }
          },
          onPanResponderRelease: (_e, gestureState) => {
            // If sheet is dragged 1/4th of it's height, close it
            if (sheetHeight.current / 4 - gestureState.dy < 0) {
              Animated.timing(pan, {
                toValue: { x: 0, y: sheetHeight.current },
                duration: 150,
                useNativeDriver: true,
              }).start(handleCloseCallback);

              setTimeout(() => {
                Animated.timing(pan, {
                  toValue: { x: 0, y: 0 },
                  duration: 150,
                  useNativeDriver: true,
                }).start();
              }, 300);
            } else {
              Animated.spring(pan, {
                toValue: { x: 0, y: 0 },
                overshootClamping: true,
                useNativeDriver: true,
              }).start();
            }
          },
        })
      ).current;

      return (
        <>
          {!hideDragIndicator ? (
            <>
              {/* To increase the draggable area */}
              <Box
                {...panResponder.panHandlers}
                {..._dragIndicatorWrapperOffSet}
              />
            </>
          ) : null}

          <Modal.Content {...resolvedProps} ref={ref} safeAreaBottom>
            {!hideDragIndicator ? (
              <>
                {/* Hack. Fix later. Add -2 negative margin to remove the padding added by ActionSheetContent */}
                <Box {...panResponder.panHandlers} {..._dragIndicatorWrapper}>
                  <Box {..._dragIndicator} />
                </Box>
              </>
            ) : null}

            {children}
          </Modal.Content>
        </>
      );
    }
  )
);
const ActionsheetContent = (
  { children, ...props }: IActionsheetContentProps,
  ref?: any
) => {
  // return null;
  const { handleClose } = React.useContext(ModalContext);
  const { hideDragIndicator } = React.useContext(ActionSheetContext);
  const pan = React.useRef(new Animated.ValueXY()).current;
  const sheetHeight = React.useRef(0);

  const handleCloseCallback = React.useCallback(handleClose, [
    ModalContext,
    handleClose,
  ]);

  // useEffect(() => {

  // }, [])

  //TODO: refactor for responsive prop
  if (useHasResponsiveProps(props)) {
    return null;
  }

  return (
    <Animated.View
      style={{
        transform: [{ translateY: pan.y }],
        width: '100%',
      }}
      onLayout={(event) => {
        const { height } = event.nativeEvent.layout;
        sheetHeight.current = height;
      }}
      pointerEvents="box-none"
    >
      <Content
        children={children}
        sheetHeight={sheetHeight}
        pan={pan}
        hideDragIndicator={hideDragIndicator}
        handleClose={handleCloseCallback}
        ref={ref}
        {...props}
      />
    </Animated.View>
  );
};

export default memo(forwardRef(ActionsheetContent));
