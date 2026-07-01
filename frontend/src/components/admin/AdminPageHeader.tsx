import type { ReactNode } from "react";

type AdminPageHeaderProps = {
  titleId: string;
  eyebrow: string;
  title: string;
  description: string;
  count: number;
  countLabel?: string;
  action?: ReactNode;
};

function AdminPageHeader({
  titleId,
  eyebrow,
  title,
  description,
  count,
  countLabel = "records",
  action,
}: AdminPageHeaderProps) {
  return (
    <div className="admin-page-header">
      <div>
        <p>{eyebrow}</p>
        <h1 id={titleId}>{title}</h1>
      </div>
      <div className="admin-page-header__details">
        <span>
          {count} {countLabel}
        </span>
        <p>{description}</p>
        {action}
      </div>
    </div>
  );
}

export default AdminPageHeader;
