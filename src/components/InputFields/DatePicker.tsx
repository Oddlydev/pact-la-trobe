import React from "react";
import InputField, { InputFieldProps } from "./InputFields";

export type DatePickerFieldProps = Omit<InputFieldProps, "type">;

export default function DatePickerField(props: DatePickerFieldProps) {
  return <InputField {...props} type="date" label={props.label ?? "Date"} />;
}
