import { Link } from "react-router-dom";

import { buttonStyles } from "../styles/uiStyles";
import { adminButtonStyles } from "../styles/adminUiStyles";

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

  adminPrimary: adminButtonStyles.primary,
  adminPrimaryLg: adminButtonStyles.primaryLg,
  adminSecondary: adminButtonStyles.secondary,
  adminSecondaryLg: adminButtonStyles.secondaryLg,
  adminSubtle: adminButtonStyles.subtle,
  adminDanger: adminButtonStyles.danger,
  adminDangerOutline: adminButtonStyles.dangerOutline,
  adminSuccess: adminButtonStyles.success,
  adminSuccessOutline: adminButtonStyles.successOutline,
  adminPrimarySm: adminButtonStyles.primarySm,
  adminSecondarySm: adminButtonStyles.secondarySm,
  adminDangerSm: adminButtonStyles.dangerSm,
  adminDangerOutlineSm: adminButtonStyles.dangerOutlineSm,
  adminSuccessSm: adminButtonStyles.successSm,
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