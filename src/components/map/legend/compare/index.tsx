import { FC } from 'react';

import { ChevronDownIcon } from '@radix-ui/react-icons';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown';

type CompareDropdownProps = {
  dates: { label: string; value: string }[];
  selectedDate: string;
  setDate: (string) => void;
};

export const CompareDropdown: FC<CompareDropdownProps> = ({
  dates,
  selectedDate,
  setDate,
}: CompareDropdownProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger>
      <div className="flex w-full justify-between">
        <span>Selected year: {selectedDate}</span>
        <ChevronDownIcon />
      </div>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      {dates?.map((d) => (
        <DropdownMenuItem key={d.value}>
          <button type="button" onClick={() => setDate(d.value)}>
            {d.label}
          </button>
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);

export default CompareDropdown;
