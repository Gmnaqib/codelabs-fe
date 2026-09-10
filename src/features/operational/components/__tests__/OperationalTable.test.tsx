import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OperationalTable from '@/features/operational/components/OperationalTable';
import { useOperationalStore } from '@/features/operational/state';

const { useOperationalTableMock, useAbsenceStatusMock, useThematicStatusMock, usePicketStatusMock } = vi.hoisted(() => ({
  useOperationalTableMock: vi.fn(),
  useAbsenceStatusMock: vi.fn(),
  useThematicStatusMock: vi.fn(),
  usePicketStatusMock: vi.fn(),
}));

vi.mock('@/features/operational/hooks', () => ({
  useOperationalTable: useOperationalTableMock,
  useAbsenceStatus: useAbsenceStatusMock,
  useThematicStatus: useThematicStatusMock,
  usePicketStatus: usePicketStatusMock,
}));

describe('OperationalTable', () => {
  beforeEach(() => {
    useOperationalStore.getState().reset();
    useOperationalTableMock.mockReturnValue({
      users: [],
      loading: false,
      error: null,
      handleToggle: vi.fn(),
      isChecked: vi.fn(),
    });
    useAbsenceStatusMock.mockReturnValue({
      getStatus: vi.fn(),
      loading: false,
      error: null,
    });
    useThematicStatusMock.mockReturnValue({
      getStatus: vi.fn(),
      loading: false,
    });
    usePicketStatusMock.mockReturnValue({
      getStatus: vi.fn(),
      loading: false,
    });
  });

  it('renders all three tabs', () => {
    render(<OperationalTable />);

    expect(screen.getByText('Absence')).toBeInTheDocument();
    expect(screen.getByText('Picket')).toBeInTheDocument();
    expect(screen.getByText('Thematic')).toBeInTheDocument();
  });

  it('shows the absence tab content by default', () => {
    render(<OperationalTable />);

    expect(screen.getByText('No attendance data available')).toBeInTheDocument();
  });

  it('switches content when clicking the Picket tab', async () => {
    const user = userEvent.setup();
    render(<OperationalTable />);

    await user.click(screen.getByText('Picket'));

    expect(screen.getByText('No picket data available')).toBeInTheDocument();
    expect(screen.queryByText('No attendance data available')).not.toBeInTheDocument();
  });

  it('switches content when clicking the Thematic tab', async () => {
    const user = userEvent.setup();
    render(<OperationalTable />);

    await user.click(screen.getByText('Thematic'));

    expect(screen.getByText('No thematic data available')).toBeInTheDocument();
    expect(screen.queryByText('No attendance data available')).not.toBeInTheDocument();
  });
});
