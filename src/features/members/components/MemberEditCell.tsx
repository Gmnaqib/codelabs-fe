"use client"

import React, { useState } from 'react';
import MemberForm from '@/features/members/components/MemberForm';
import type { User } from '@/types/domain';

interface MemberEditCellProps {
  member: User;
  onSuccess?: () => void;
}

export default function MemberEditCell({ member, onSuccess }: MemberEditCellProps) {
  const [open, setOpen] = useState(false);

  return <MemberForm mode="edit" member={member} open={open} onOpenChange={setOpen} onSuccess={onSuccess} />;
}
