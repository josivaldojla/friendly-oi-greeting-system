
import * as React from "react"
import {
  toast as sonnerToast,
  type ToastT as Toast,
} from "sonner"

// Define nossos tipos personalizados
type ToastOptions = React.ComponentPropsWithoutRef<typeof sonnerToast>;
type ToastActionElement = React.ReactElement<any>;

type ToastProps = Partial<Toast> & {
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  variant?: "default" | "destructive" | "success"
}

const useToast = () => {
  // Usando um estado para armazenar os toasts ativos
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);

  return {
    toast: (props: ToastProps) => {
      const { title, description, variant, ...options } = props;
      // Adiciona o toast à lista
      const id = Math.random().toString(36).substring(2, 9);
      const newToast = { id, title, description, variant, ...options };
      setToasts((current) => [...current, newToast]);
      
      return sonnerToast(title as string, {
        description,
        ...options
      });
    },
    dismiss: (toastId?: string | number) => {
      if (toastId) {
        setToasts((current) => current.filter((t) => t.id !== toastId));
      }
      return sonnerToast.dismiss(toastId);
    },
    error: (message: string) => sonnerToast.error(message),
    success: (message: string) => sonnerToast.success(message),
    toasts: toasts,
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
