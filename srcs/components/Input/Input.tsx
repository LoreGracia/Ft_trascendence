import { InputHTMLAttributes, useState } from "react";
import "./Input.css";
import { Eye, EyeClosed } from "lucide-react";

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export default function TextInput({ label, error, ...props}: TextInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = props.type === "password";
  return (
    <div>
      { label && <h2>{label}</h2>}
      <div className="flex items-center relative">
        <input
          {...props}
          type={isPassword && showPassword ? "text" : props.type}
          className={`input ${props.className ?? ""}, className="rounded-lg ps-4 pb-2 pt-2 "`}
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
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

// export default function TextInput(props: TextInputProps) {
//   const [showPassword, setShowPassword] = useState(false);
//   const isPassword = props.type === "password";
//   return (
//     <div className="flex items-center relative">
//       <input
//         {...props}
//         type={isPassword && showPassword ? "text" : props.type}
//         className={`input ${props.className ?? ""}, className="rounded-lg ps-4 pb-2 pt-2 "`}
//       />
//       {isPassword && (
//           <button
//             className="absolute  right-2 bg-(--white)"
//             type="button"
//             onClick={() => setShowPassword(!showPassword)}
//           >
//             {showPassword ?
//             (<Eye size={12} color="var(--black)" /> ) : 
//             (<EyeClosed size={12} color="var(--black)" /> )
//             }
//           </button>
//       )}
//     </div>
//   );
// }