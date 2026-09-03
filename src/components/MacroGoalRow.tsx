import type { ChangeEvent, ReactNode } from "react";

type MacroGoalRowProp = {
  isChecked: boolean;
  children: ReactNode;
  unit: string;
  value: number;
  onChangeCheckbox: (event: ChangeEvent) => void;
  onChange: (event: number) => void;
};

export const MacroGoalRow = ({
  isChecked,
  onChangeCheckbox,
  unit,
  value,
  onChange,
  children,
}: MacroGoalRowProp) => {
  return (
    <div className="flex gap-2 items-center py-[4px]">
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          onChange={onChangeCheckbox}
          checked={isChecked}
          type="checkbox"
          className="w-4 h-4 rounded-sm accent-indigo-600 scale-110 origin-center"
        />
        <span>{children}</span>
      </label>{" "}
      {isChecked && (
        <div>
          <input
            className="w-[70px] px-[5px] border rounded-[5px] mr-[2px]"
            onChange={(e) => onChange(Number(e.target.value))}
            type="number"
            defaultValue={value}
          />
          <span>{unit}</span>
        </div>
      )}
    </div>
  );
};
