import { InputHTMLAttributes, useState } from "react";
import "./Input.css";
import { Eye, EyeClosed } from "lucide-react";

type TextInputProps = InputHTMLAttributes<HTMLInputElement>;

export default function TextInput(props: TextInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = props.type === "password";
  return (
    <div className="flex items-center relative">
      <input
        {...props}
        type={isPassword && showPassword ? "text" : props.type}
        className={`input ${props.className ?? ""}`}
      />
      {isPassword && (
          <button
            className="absolute  right-2 bg-(--white)"
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ?
            (<Eye size={12} color="var(--black)" /> ) : 
            (<EyeClosed size={12} color="var(--black)" /> )
            }
          </button>
      )}
    </div>
  );
}
// absolute right-0 p-0 m-0 flex items-center justify-center leading-none