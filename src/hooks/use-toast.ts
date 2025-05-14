
import * as React from "react"
import {
  toast as sonnerToast,
  type Toast,
} from "sonner"

type ToastProps = Toast & {
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

// Add success, error, and other helper methods
toast.success = (message: string) => {
  sonnerToast.success(message);
};

toast.error = (message: string) => {
  sonnerToast.error(message);
};

toast.info = (message: string) => {
  sonnerToast.info(message);
};

toast.warning = (message: string) => {
  sonnerToast.warning(message);
};

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
