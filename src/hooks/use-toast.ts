
import * as React from "react"
import {
  toast as sonnerToast,
  type ToastT as Toast,
  ToastActionElement,
  ToastOptions as SonnerToastOptions,
} from "sonner"

type ToastOptions = SonnerToastOptions;

type ToastProps = Partial<Toast> & {
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  variant?: "default" | "destructive" | "success"
}

const useToast = () => {
  return {
    toast: (props: ToastProps) => {
      const { title, description, variant, ...options } = props
      return sonnerToast(title as string, {
        description,
        ...options
      });
    },
    dismiss: sonnerToast.dismiss,
    error: (message: string) => sonnerToast.error(message),
    success: (message: string) => sonnerToast.success(message),
  }
}

export { useToast, type ToastProps, type ToastOptions }

// Exportamos também o toast diretamente para uso mais fácil
export const toast = {
  error: (message: string) => sonnerToast.error(message),
  success: (message: string) => sonnerToast.success(message),
  info: (message: string) => sonnerToast.info(message),
  warning: (message: string) => sonnerToast.warning(message),
  dismiss: sonnerToast.dismiss,
}
