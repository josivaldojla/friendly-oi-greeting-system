
import * as React from "react"
import { toast as sonnerToast } from "sonner"

type ToastProps = {
  id?: string;
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  variant?: "default" | "destructive" | "success"
}

type ToastOptions = Omit<ToastProps, "title"> & {
  duration?: number
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top-center" | "bottom-center"
}

const useToast = () => {
  const [toasts, setToasts] = React.useState<ToastProps[]>([])

  return {
    toast: (props: ToastProps) => {
      const { title, description, ...options } = props
      const id = Math.random().toString(36).substring(2, 9)
      setToasts((current) => [...current, { id, title, description, ...options }])
      
      return sonnerToast(title as string, {
        description,
        ...options
      })
    },
    dismiss: (toastId?: string) => {
      if (toastId) {
        setToasts((current) => current.filter((t) => t.id !== toastId))
      }
      return sonnerToast.dismiss(toastId)
    },
    toasts
  }
}

// Exporta diretamente o toast de sonner para uso mais fácil
export const toast = sonnerToast

export { useToast, type ToastProps, type ToastOptions }
