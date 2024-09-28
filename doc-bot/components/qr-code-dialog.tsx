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
          <DialogTitle>Scan QR Code to Call</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center">
          <QRCodeSVG value={`tel:${phoneNumber}`} size={256} />
        </div>
        <p className="text-center mt-4">Scan this QR code with your mobile device to initiate the call.</p>
      </DialogContent>
    </Dialog>
  )
}
