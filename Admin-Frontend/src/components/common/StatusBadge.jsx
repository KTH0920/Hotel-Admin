const StatusBadge = ({ status, type = "booking" }) => {
  const getStatusConfig = () => {
    if (type === "booking") {
      const statusMap = {
        pending: { label: "대기", className: "badge-warning" },
        confirmed: { label: "확정", className: "badge-success" },
        cancelled: { label: "취소", className: "badge-danger" },
        completed: { label: "완료", className: "badge-info" },
      };
      return (
        statusMap[status] || { label: status, className: "badge-secondary" }
      );
    }

    if (type === "room") {
      const statusMap = {
        available: { label: "판매중", className: "badge-success" },
        unavailable: { label: "판매중지", className: "badge-danger" },
        maintenance: { label: "정비중", className: "badge-warning" },
      };
      return (
        statusMap[status] || { label: status, className: "badge-secondary" }
      );
    }

    if (type === "review") {
      const statusMap = {
        approved: { label: "승인", className: "badge-success" },
        pending: { label: "대기", className: "badge-warning" },
        reported: { label: "신고됨", className: "badge-danger" },
      };
      return (
        statusMap[status] || { label: status, className: "badge-secondary" }
      );
    }

    if (type === "coupon") {
      const statusMap = {
        active: { label: "활성", className: "badge-success" },
        inactive: { label: "비활성", className: "badge-secondary" },
        expired: { label: "만료", className: "badge-danger" },
      };
      return (
        statusMap[status] || { label: status, className: "badge-secondary" }
      );
    }

    if (type === "business") {
      const statusMap = {
        active: { label: "운영 중", className: "badge-success" },
        pending: { label: "심사 중", className: "badge-warning" },
        suspended: { label: "중지", className: "badge-danger" },
      };
      return (
        statusMap[status] || { label: status, className: "badge-secondary" }
      );
    }

    return { label: status, className: "badge-secondary" };
  };

  const config = getStatusConfig();

  return <span className={`badge ${config.className}`}>{config.label}</span>;
};

export default StatusBadge;
