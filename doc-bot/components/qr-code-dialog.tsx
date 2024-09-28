'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {QRCodeSVG} from 'qrcode.react';

interface QRCodeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  phoneNumber: string
}

export function QRCodeDialog({ open, onOpenChange, phoneNumber }: QRCodeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>QR-Code scannen zum Anrufen</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center">
          <QRCodeSVG value={`tel:${phoneNumber}`} size={256} />
        </div>
        <p className="text-center mt-4">Scannen Sie diesen QR-Code mit Ihrem Mobilgerät, um den Anruf zu starten.</p>
      </DialogContent>
    </Dialog>
  )
}
