import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BaseTable, type TableColumn } from '@/features/table/components/BaseTable';

interface Row {
  _id: string;
  name: string;
  age: number;
}

const columns: TableColumn<Row>[] = [
  { key: 'name', label: 'Name' },
  { key: 'age', label: 'Age' },
];

const rows: Row[] = [
  { _id: '1', name: 'Alice', age: 30 },
  { _id: '2', name: 'Bob', age: 25 },
];

describe('BaseTable', () => {
  it('renders column headers and row data', () => {
    render(<BaseTable data={rows} columns={columns} />);

    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Age' })).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
  });

  it('shows a spinner instead of the table while loading', () => {
    render(<BaseTable data={rows} columns={columns} loading />);

    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('shows the empty message when there is no data', () => {
    render(<BaseTable data={[]} columns={columns} emptyMessage="No rows here" />);

    expect(screen.getByText('No rows here')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('calls onRowClick with the clicked row', async () => {
    const user = userEvent.setup();
    const onRowClick = vi.fn();

    render(<BaseTable data={rows} columns={columns} onRowClick={onRowClick} />);

    await user.click(screen.getByText('Alice'));

    expect(onRowClick).toHaveBeenCalledTimes(1);
    expect(onRowClick).toHaveBeenCalledWith(rows[0]);
  });
});
