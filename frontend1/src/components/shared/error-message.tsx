import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  title?: string;
  message: string;
  retry?: () => void;
}

export function ErrorMessage({
  title = "Bir Hata Oluştu",
  message,
  retry,
}: ErrorMessageProps) {
  return (
    <Alert variant="destructive" className="max-w-2xl mx-auto">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="mt-2">
        <p>{message}</p>
        {retry && (
          <Button variant="outline" size="sm" onClick={retry} className="mt-4">
            Tekrar Dene
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
