'use client'

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MailIcon } from 'lucide-react'

interface Step4Props {
  emailContent: string
  onEmailContentChange: (content: string) => void
  onSendEmails: () => void
  onBack: () => void
  isLoading: boolean
  emailStatus: { success: boolean; message: string } | null
}

export function Step4EmailCompose({ 
  emailContent, 
  onEmailContentChange, 
  onSendEmails, 
  onBack, 
  isLoading, 
  emailStatus 
}: Step4Props) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Überprüfen und bearbeiten Sie die E-Mail an die ausgewählten Ärzte:</p>
      <Textarea
        placeholder="Ihre Nachricht an die Ärzte..."
        value={emailContent}
        onChange={(e) => onEmailContentChange(e.target.value)}
        rows={10}
      />
      {emailStatus && (
        <p className={emailStatus.success ? "text-green-600" : "text-red-600"}>
          {emailStatus.message}
        </p>
      )}
      <div className="flex justify-between">
        <Button onClick={onBack}>Zurück</Button>
        <Button 
          onClick={onSendEmails} 
          disabled={!emailContent || isLoading}
          className="flex items-center"
        >
          <MailIcon className="w-4 h-4 mr-2" />
          {isLoading ? "Sende E-Mails..." : "E-Mails senden"}
        </Button>
      </div>
    </div>
  )
}
