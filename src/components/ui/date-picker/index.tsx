"use client";

import { CalendarDate, type DateValue } from "@internationalized/date";
import {
  DatePickerClearTrigger,
  DatePickerContent,
  DatePickerContext,
  DatePickerControl,
  DatePickerInput,
  DatePickerLabel,
  DatePickerNextTrigger,
  DatePickerPositioner,
  DatePickerPrevTrigger,
  DatePickerRoot,
  DatePickerTable,
  DatePickerTableBody,
  DatePickerTableCell,
  DatePickerTableCellTrigger,
  DatePickerTableHead,
  DatePickerTableHeader,
  DatePickerTableRow,
  DatePickerTrigger,
  Portal,
} from "@ark-ui/react";
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Icon } from "@/components/ui/primitives/icon";

function toCalendarDate(date?: Date | null): CalendarDate | undefined {
  if (!date) return undefined;
  return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

function toJsDate(value: DateValue[]): Date | null {
  const first = value[0];
  if (!first) return null;
  return new Date(first.year, first.month - 1, first.day);
}

export type DatePickerProps = {
  label?: string;
  description?: string;
  error?: string;
  placeholder?: string;
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (date: Date | null) => void;
  disabled?: boolean;
  required?: boolean;
  clearable?: boolean;
  className?: string;
};

export function DatePicker({
  label,
  description,
  error,
  placeholder = "Selecione uma data",
  value,
  defaultValue,
  onValueChange,
  disabled,
  required,
  clearable = true,
  className,
}: DatePickerProps) {
  return (
    <DatePickerRoot
      locale="pt-BR"
      value={value !== undefined ? [toCalendarDate(value)].filter(Boolean) as CalendarDate[] : undefined}
      defaultValue={
        defaultValue !== undefined
          ? ([toCalendarDate(defaultValue)].filter(Boolean) as CalendarDate[])
          : undefined
      }
      onValueChange={(details) => onValueChange?.(toJsDate(details.value))}
      disabled={disabled}
      className={cn("flex flex-col gap-1.5", className)}
    >
      {label && (
        <DatePickerLabel className="text-label font-medium text-foreground">
          {label}
          {required && <span className="text-danger"> *</span>}
        </DatePickerLabel>
      )}
      <DatePickerControl
        className={cn(
          "flex h-10 items-center gap-1 rounded-md border border-border bg-surface pl-3 pr-1 transition-colors",
          "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
          error && "border-danger",
          disabled && "pointer-events-none bg-surface-muted opacity-50",
        )}
      >
        <DatePickerInput
          placeholder={placeholder}
          className="h-full flex-1 bg-transparent text-body text-foreground outline-none placeholder:text-muted"
        />
        {clearable && (
          <DatePickerClearTrigger className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted hover:bg-surface-hover hover:text-foreground">
            <Icon icon={X} size="sm" />
          </DatePickerClearTrigger>
        )}
        <DatePickerTrigger className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted hover:bg-surface-hover hover:text-foreground">
          <Icon icon={Calendar} size="sm" />
        </DatePickerTrigger>
      </DatePickerControl>
      <Portal>
        <DatePickerPositioner>
          <DatePickerContent className="z-50 rounded-lg border border-border bg-surface p-3 shadow-float">
            <DatePickerContext>
              {(api) => (
                <>
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <DatePickerPrevTrigger className="flex size-7 items-center justify-center rounded-md text-muted hover:bg-surface-hover hover:text-foreground">
                      <Icon icon={ChevronLeft} size="sm" />
                    </DatePickerPrevTrigger>
                    <span className="text-body-sm font-medium text-foreground capitalize">
                      {api.visibleRangeText.formatted}
                    </span>
                    <DatePickerNextTrigger className="flex size-7 items-center justify-center rounded-md text-muted hover:bg-surface-hover hover:text-foreground">
                      <Icon icon={ChevronRight} size="sm" />
                    </DatePickerNextTrigger>
                  </div>
                  <DatePickerTable>
                    <DatePickerTableHead>
                      <DatePickerTableRow>
                        {api.weekDays.map((weekDay, index) => (
                          <DatePickerTableHeader
                            key={index}
                            className="pb-1 text-caption font-medium text-muted"
                          >
                            {weekDay.narrow}
                          </DatePickerTableHeader>
                        ))}
                      </DatePickerTableRow>
                    </DatePickerTableHead>
                    <DatePickerTableBody>
                      {api.weeks.map((week, weekIndex) => (
                        <DatePickerTableRow key={weekIndex}>
                          {week.map((day, dayIndex) => (
                            <DatePickerTableCell key={dayIndex} value={day}>
                              <DatePickerTableCellTrigger
                                className={cn(
                                  "flex size-8 items-center justify-center rounded-md text-body-sm text-foreground",
                                  "hover:bg-surface-hover",
                                  "data-[today]:font-semibold",
                                  "data-[selected]:bg-primary data-[selected]:text-primary-foreground data-[selected]:hover:bg-primary-hover",
                                  "data-[outside-range]:text-muted data-[outside-range]:opacity-50",
                                  "data-[disabled]:pointer-events-none data-[disabled]:opacity-30",
                                )}
                              >
                                {day.day}
                              </DatePickerTableCellTrigger>
                            </DatePickerTableCell>
                          ))}
                        </DatePickerTableRow>
                      ))}
                    </DatePickerTableBody>
                  </DatePickerTable>
                </>
              )}
            </DatePickerContext>
          </DatePickerContent>
        </DatePickerPositioner>
      </Portal>
      {error ? (
        <span className="text-caption text-danger">{error}</span>
      ) : description ? (
        <span className="text-caption text-muted">{description}</span>
      ) : null}
    </DatePickerRoot>
  );
}
