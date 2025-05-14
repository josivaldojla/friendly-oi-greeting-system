
import * as React from "react"
import {
  toast as sonnerToast,
  ToastActionElement,
  ToastProps as SonnerToastProps,
} from "sonner"

type ToastProps = SonnerToastProps & {
  title?: string
  description?: React.ReactNode
  action?: ToastActionElement
}

const toast = ({ title, description, action, ...props }: ToastProps) => {
  sonnerToast(title, {
    description,
    action,
    ...props,
  })
}

export { toast }

export function useToast() {
  return React.useMemo(
    () => ({
      toast,
      dismiss: sonnerToast.dismiss,
      toasts: [],
    }),
    []
  )
}
