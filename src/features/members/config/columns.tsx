import type { TableColumn } from '@/features/table/components';
import type { User, UserRole } from '@/types/domain';
import { SUBRISET_OPTIONS } from '@/types/domain/user';
import { ROLE_LABELS } from '@/shared/constants';
import MemberInlineSelect from '@/features/members/components/MemberInlineSelect';

interface SelectOption {
  value: string;
  title: string;
}

const SUB_RISET_TITLES: Record<string, string> = {
  website: 'Website',
  mobile: 'Mobile',
  game: 'Game',
  'ui/ux': 'UI/UX',
  data: 'Data',
  other: 'Other',
};

const SUB_RISET_OPTIONS: SelectOption[] = SUBRISET_OPTIONS.map((value) => ({
  value,
  title: SUB_RISET_TITLES[value] ?? value,
}));

// The full role name is shown in the dropdown list; the closed cell only
// shows the last word ("Minister of Branding" -> "Branding") so the column
// stays narrow. "Vice President" is special-cased to "Vice" so it isn't
// mistaken for the plain "President" role, which shares the same last word.
function getShortRoleLabel(role: string): string {
  if (role === 'vice president') return 'Vice';
  const label = ROLE_LABELS[role as UserRole] ?? role;
  const words = label.trim().split(/\s+/);
  return words[words.length - 1];
}

// change_mac_address is a real boolean on the API; Radix Select only accepts
// string item values, so we use "true"/"false" strings and convert back to
// a boolean via `serialize` right before sending the update.
const DEVICE_ID_OPTIONS: SelectOption[] = [
  { value: 'true', title: 'Enabled' },
  { value: 'false', title: 'Disabled' },
];

const STATUS_OPTIONS: SelectOption[] = [
  { value: 'active', title: 'Active' },
  { value: 'inactive', title: 'Inactive' },
  { value: 'graduated', title: 'Graduated' },
];

interface CreateMemberColumnsParams {
  roleOptions: SelectOption[];
  productOptions: SelectOption[];
  onSaved?: () => void;
}

export function createMemberColumns({ roleOptions, productOptions, onSaved }: CreateMemberColumnsParams): TableColumn<User>[] {
  return [
    { key: 'nim', label: 'NIM', width: 120, className: 'text-center' },
    {
      key: 'name',
      label: 'Name',
      width: 180,
      className: 'text-center',
      render: (_value, row) => row.name?.split(' ')[0] ?? '-',
    },
    { key: 'email', label: 'Email', width: 220, className: 'hidden text-center md:table-cell' },
    {
      key: 'research',
      label: 'Sub Riset',
      width: 150,
      className: 'hidden text-center md:table-cell',
      render: (_value, row) => (
        <MemberInlineSelect
          userId={row._id}
          field="research"
          value={row.research ?? ''}
          options={SUB_RISET_OPTIONS}
          onSaved={onSaved}
        />
      ),
    },
    {
      key: 'product_id' as keyof User & string,
      label: 'Product',
      width: 160,
      className: 'hidden text-center md:table-cell',
      render: (_value, row) => (
        <MemberInlineSelect
          userId={row._id}
          field="product_id"
          value={row.product_id ?? ''}
          options={productOptions}
          onSaved={onSaved}
        />
      ),
    },
    {
      key: 'role',
      label: 'Role',
      width: 200,
      className: 'hidden text-center md:table-cell',
      render: (_value, row) => (
        <MemberInlineSelect
          userId={row._id}
          field="role"
          value={row.role}
          options={roleOptions}
          displayValue={getShortRoleLabel(row.role)}
          onSaved={onSaved}
        />
      ),
    },
    {
      key: 'change_mac_address' as keyof User & string,
      label: 'Device Id',
      width: 140,
      className: 'text-center',
      render: (_value, row) => (
        <MemberInlineSelect
          userId={row._id}
          field="change_mac_address"
          value={String(!!row.change_mac_address)}
          options={DEVICE_ID_OPTIONS}
          serialize={(v) => v === 'true'}
          onSaved={onSaved}
        />
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: 150,
      className: 'hidden text-center md:table-cell',
      render: (_value, row) => (
        <MemberInlineSelect
          userId={row._id}
          field="status"
          value={row.status}
          options={STATUS_OPTIONS}
          onSaved={onSaved}
        />
      ),
    },
  ];
}
