
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';

export default function AddAddressModal({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    recipientName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    notes: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({
      recipientName: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
      notes: ''
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">Thêm Địa Chỉ Mới</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="recipientName">Tên người nhận *</Label>
              <Input id="recipientName" name="recipientName" required value={formData.recipientName} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại *</Label>
              <Input id="phone" name="phone" type="tel" required value={formData.phone} onChange={handleChange} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Địa chỉ *</Label>
            <Input id="address" name="address" required value={formData.address} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Thành phố/Tỉnh *</Label>
              <Input id="city" name="city" required value={formData.city} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">Mã bưu chính *</Label>
              <Input id="postalCode" name="postalCode" required value={formData.postalCode} onChange={handleChange} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Ghi chú (Tùy chọn)</Label>
            <Textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows={3} />
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>Hủy</Button>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">Thêm</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
