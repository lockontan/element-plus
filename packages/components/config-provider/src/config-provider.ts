import { defineComponent, renderSlot, watch } from 'vue'
import { buildProps, definePropType } from '@element-plus/utils'
import { provideGlobalConfig } from '@element-plus/hooks'
import { useFormSizeProp } from '@element-plus/components/form'

import type { ExtractPropTypes } from 'vue'
import type { ExperimentalFeatures } from '@element-plus/tokens'
import type { Language } from '@element-plus/locale'
import type { ButtonConfigContext } from '@element-plus/components/button'
import type { MessageConfigContext } from '@element-plus/components/message'

export const messageConfig: MessageConfigContext = {}

export const configProviderProps = buildProps({
  /**
   * @description Controlling if the users want a11y features
   */
  a11y: {
    type: Boolean,
    default: true,
  },
  /**
   * @description Locale Object
   */
  locale: {
    type: definePropType<Language>(Object),
  },
  /**
   * @description global component size
   */
  size: useFormSizeProp,
  /**
   * @description button related configuration, [see the following table](#button-attributes)
   */
  button: {
    type: definePropType<ButtonConfigContext>(Object),
  },
  /**
   * @description features at experimental stage to be added, all features are default to be set to false                                                                                | ^[object]
   */
  experimentalFeatures: {
    type: definePropType<ExperimentalFeatures>(Object),
  },
  /**
   * @description Controls if we should handle keyboard navigation
   */
  keyboardNavigation: {
    type: Boolean,
    default: true,
  },
  /**
   * @description message related configuration, [see the following table](#message-attributes)
   */
  message: {
    type: definePropType<MessageConfigContext>(Object),
  },
  /**
   * @description global Initial zIndex
   */
  zIndex: Number,
  /**
   * @description global component className prefix (cooperated with [$namespace](https://github.com/element-plus/element-plus/blob/dev/packages/theme-chalk/src/mixins/config.scss#L1)) | ^[string]
   */
  namespace: {
    type: String,
    default: 'el',
  },
} as const)
export type ConfigProviderProps = ExtractPropTypes<typeof configProviderProps>

const ConfigProvider = defineComponent({
  name: 'ElConfigProvider',
  props: configProviderProps,

  setup(props, { slots }) {
    watch(
      () => props.message,
      (val) => {
        Object.assign(messageConfig, val ?? {})
      },
      { immediate: true, deep: true }
    )
    const config = provideGlobalConfig(props)
    return () => renderSlot(slots, 'default', { config: config?.value })
  },
})
export type ConfigProviderInstance = InstanceType<typeof ConfigProvider>

export default ConfigProvider
