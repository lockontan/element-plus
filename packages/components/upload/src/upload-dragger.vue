<template>
  <div
    :class="[ns.b('dragger'), ns.is('dragover', dragover)]"
    @drop.prevent="onDrop"
    @dragover.prevent="onDragover"
    @dragleave.prevent="dragover = false"
  >
    <slot />
  </div>
</template>
<script lang="ts" setup>
import { inject, ref } from 'vue'
import { useNamespace } from '@element-plus/hooks'
import { useFormDisabled } from '@element-plus/components/form'
import { uploadContextKey } from '@element-plus/tokens'
import { throwError } from '@element-plus/utils/error'
import { uploadDraggerEmits, uploadDraggerProps } from './upload-dragger'

const COMPONENT_NAME = 'ElUploadDrag'

defineOptions({
  name: COMPONENT_NAME,
})

defineProps(uploadDraggerProps)
const emit = defineEmits(uploadDraggerEmits)

const uploaderContext = inject(uploadContextKey)
if (!uploaderContext) {
  throwError(
    COMPONENT_NAME,
    'usage: <el-upload><el-upload-dragger /></el-upload>'
  )
}

const ns = useNamespace('upload')
const dragover = ref(false)
const disabled = useFormDisabled()

const onDrop = (e: DragEvent) => {
  if (disabled.value) return
  dragover.value = false

  e.stopPropagation()

  const files = Array.from(e.dataTransfer!.files)
  const accept = uploaderContext.accept.value
  if (!accept) {
    emit('file', files)
    return
  }

  const filesFiltered = files.filter((file) => {
    const { type, name } = file
    const extension = name.includes('.') ? `.${name.split('.').pop()}` : ''
    const baseType = type.replace(/\/.*$/, '')
    return accept
      .split(',')
      .map((type) => type.trim())
      .filter((type) => type)
      .some((acceptedType) => {
        if (acceptedType.startsWith('.')) {
          return extension === acceptedType
        }
        if (/\/\*$/.test(acceptedType)) {
          return baseType === acceptedType.replace(/\/\*$/, '')
        }
        if (/^[^/]+\/[^/]+$/.test(acceptedType)) {
          return type === acceptedType
        }
        return false
      })
  })

  emit('file', filesFiltered)
}

const onDragover = () => {
  if (!disabled.value) dragover.value = true
}
</script>
