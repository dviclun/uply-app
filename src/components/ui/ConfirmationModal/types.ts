export type ConfirmationModalProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmText: string;
  error?: string | null;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
};
