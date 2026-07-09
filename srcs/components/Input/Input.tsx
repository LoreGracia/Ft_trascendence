// components/TextInput.tsx
import { InputHTMLAttributes } from "react";
import "./Input.css";

type TextInputProps = InputHTMLAttributes<HTMLInputElement>;

export default function TextInput(props: TextInputProps) {
  return (
    <input
      {...props}
      className={`input ${props.className ?? ""}`}
    />
  );
}