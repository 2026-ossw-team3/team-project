import { Link } from "react-router-dom";

import { buttonStyles } from "../styles/uiStyles";

const VARIANT_CLASS_MAP = {
  primary: buttonStyles.primary,
  primaryLg: buttonStyles.primaryLg,
  secondary: buttonStyles.secondary,
  secondaryLg: buttonStyles.secondaryLg,
  subtle: buttonStyles.subtle,
  danger: buttonStyles.danger,
  dangerOutline: buttonStyles.dangerOutline,
  success: buttonStyles.success,
  successOutline: buttonStyles.successOutline,
};

function Button({
  to,
  type = "button",
  variant = "primary",
  className = "",
  children,
  ...props
}) {
  const variantClass = VARIANT_CLASS_MAP[variant] ?? buttonStyles.primary;
  const combinedClassName = `${variantClass} ${className}`.trim();

  if (to) {
    return (
      <Link to={to} className={combinedClassName} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={combinedClassName} {...props}>
      {children}
    </button>
  );
}

export default Button;