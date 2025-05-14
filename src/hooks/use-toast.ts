
import * as React from "react"
import {
  toast as sonnerToast,
  type ToastT,
  type Toast as SonnerToast,
} from "sonner"

type ToastProps = SonnerToast & {
  title?: string
  description?: React.ReactNode
  action?: React.ReactNode
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
