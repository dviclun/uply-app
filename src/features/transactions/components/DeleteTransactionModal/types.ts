export type DeleteTransactionModalProps = {
  visible: boolean;
  loading: boolean;
  error?: string | null;
  onClose: () => void;
  onConfirm: () => void;
};
