import * as React from 'react'
import {
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
  Platform,
  StatusBar,
} from 'react-native'

import { MD3Theme, Provider, useTheme } from 'react-native-paper'
import DatePickerModalContent, {
  DatePickerModalContentMultiProps,
  DatePickerModalContentRangeProps,
  DatePickerModalContentSingleProps,
} from './DatePickerModalContent'
import { useHeaderBackgroundColor, useHeaderColorIsLight } from '../utils'

interface DatePickerModalProps {
  visible: boolean
  fullScreen?: boolean
  animationType?: 'slide' | 'fade' | 'none'
  disableStatusBar?: boolean
  disableStatusBarPadding?: boolean
  inputEnabled?: boolean
  customTheme?: MD3Theme
}

export interface DatePickerModalSingleProps
  extends DatePickerModalContentSingleProps,
    DatePickerModalProps {}

export interface DatePickerModalMultiProps
  extends DatePickerModalContentMultiProps,
    DatePickerModalProps {}

export interface DatePickerModalRangeProps
  extends DatePickerModalContentRangeProps,
    DatePickerModalProps {}

export function DatePickerModal(
  props:
    | DatePickerModalRangeProps
    | DatePickerModalSingleProps
    | DatePickerModalMultiProps
) {
  const theme = useTheme(props.customTheme)
  const dimensions = useWindowDimensions()
  const {
    visible,
    animationType,
    disableStatusBar,
    disableStatusBarPadding,
    inputEnabled,
    fullScreen = true,
    ...rest
  } = props
  const animationTypeCalculated =
    animationType ||
    Platform.select({
      web: 'none',
      default: 'slide',
    })

  const isLight = useHeaderColorIsLight()
  const headerBackgroundColor = useHeaderBackgroundColor()

  return (
    <View style={[StyleSheet.absoluteFill]} pointerEvents="box-none">
      <Modal
        animationType={animationTypeCalculated}
        transparent={true}
        visible={visible}
        onRequestClose={rest.onDismiss}
        presentationStyle="overFullScreen"
        supportedOrientations={supportedOrientations}
        //@ts-ignore
        statusBarTranslucent={true}
      >
        <Provider theme={props.customTheme}>
          <TouchableWithoutFeedback onPress={rest.onDismiss}>
            <View
              style={[
                StyleSheet.absoluteFill,
                styles.modalBackground,
                { backgroundColor: theme.colors.backdrop },
              ]}
            />
          </TouchableWithoutFeedback>
          <View
            style={[StyleSheet.absoluteFill, styles.modalRoot]}
            pointerEvents="box-none"
          >
            <View
              style={[
                styles.modalContent,
                // { backgroundColor: theme.colors.surface },
                { backgroundColor: theme.colors.elevation.level3 },
                dimensions.width > 650 ? styles.modalContentBig : null,
                fullScreen ? null : styles.modalContentDialog,
              ]}
            >
              {disableStatusBar || !fullScreen ? null : (
                <StatusBar
                  translucent={true}
                  barStyle={isLight ? 'dark-content' : 'light-content'}
                />
              )}
              {disableStatusBarPadding || !fullScreen ? null : (
                <View
                  style={[
                    {
                      height: StatusBar.currentHeight,
                      backgroundColor: headerBackgroundColor,
                    },
                  ]}
                />
              )}
              <DatePickerModalContent
                {...rest}
                fullScreen={fullScreen}
                inputEnabled={inputEnabled}
                disableSafeTop={!fullScreen || disableStatusBar}
              />
            </View>
          </View>
        </Provider>
      </Modal>
    </View>
  )
}
const supportedOrientations: any = [
  'portrait',
  'portrait-upside-down',
  'landscape',
  'landscape-left',
  'landscape-right',
]

const styles = StyleSheet.create({
  modalRoot: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  modalBackground: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
    width: '100%',
  },
  modalContentBig: {
    maxWidth: 600,
    maxHeight: 800,
    borderRadius: 10,
    width: '100%',
    overflow: 'hidden',
  },
  modalContentDialog: {
    flex: 0,
    height: 542,
    width: 328,
    paddingBottom: 8,
  },
})

export default React.memo(DatePickerModal)
