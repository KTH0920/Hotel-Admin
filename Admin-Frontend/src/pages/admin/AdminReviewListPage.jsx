import { useState, useEffect } from "react";
import { adminReviewApi } from "../../api/adminReviewApi";
import AlertModal from "../../components/common/AlertModal";
import ConfirmDialog from "../../components/common/ConfirmDialog";

const AdminReviewListPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertModal, setAlertModal] = useState({ isOpen: false, message: "", type: "info" });
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, reviewId: null, action: null });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const data = await adminReviewApi.getReviews();
      setReviews(data.reviews);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveReport = async (reviewId) => {
    try {
      await adminReviewApi.approveReport(reviewId);
      setAlertModal({ isOpen: true, message: "리뷰가 삭제되었습니다.", type: "success" });
      setConfirmDialog({ isOpen: false, reviewId: null, action: null });
      fetchReviews();
    } catch (error) {
      setAlertModal({ isOpen: true, message: "리뷰 삭제에 실패했습니다.", type: "error" });
    }
  };

  const handleRejectReport = async (reviewId) => {
    try {
      await adminReviewApi.rejectReport(reviewId);
      setAlertModal({ isOpen: true, message: "신고가 거부되어 리뷰가 복원되었습니다.", type: "success" });
      setConfirmDialog({ isOpen: false, reviewId: null, action: null });
      fetchReviews();
    } catch (error) {
      setAlertModal({ isOpen: true, message: "신고 거부 처리에 실패했습니다.", type: "error" });
    }
  };

  const openConfirmDialog = (reviewId, action) => {
    setConfirmDialog({ isOpen: true, reviewId, action });
  };

  const handleConfirmAction = () => {
    if (confirmDialog.action === "approve") {
      handleApproveReport(confirmDialog.reviewId);
    } else if (confirmDialog.action === "reject") {
      handleRejectReport(confirmDialog.reviewId);
    }
  };

  // 관리자는 신고된 리뷰만 확인
  const filteredReviews = reviews.filter((review) => review.status === "reported");

  const getStatusText = (status) => {
    const statusMap = {
      approved: "승인됨",
      reported: "신고됨",
      pending: "대기 중",
    };
    return statusMap[status] || status;
  };

  const getRatingStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>리뷰 관리</h1>
          <p>고객 리뷰를 확인하고 관리합니다</p>
        </div>
      </div>

      <div className="card">
        <div className="card__header">
          <h3>신고된 리뷰 관리</h3>
          <p style={{ color: "#64748b", fontSize: "0.875rem", marginTop: "0.5rem" }}>
            사업자가 신고한 리뷰를 검토하고 승인 또는 거부할 수 있습니다.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {filteredReviews.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>
              신고된 리뷰가 없습니다.
            </div>
          ) : (
            filteredReviews.map((review) => (
            <div
              key={review.id}
              style={{
                padding: "1rem",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.5rem",
                }}
              >
                <p style={{ color: "#64748b", fontSize: "0.875rem" }}>
                  {review.guestName} · {review.roomType} · {review.date}
                </p>
                <span className={`status-badge ${review.status}`}>
                  {getStatusText(review.status)}
                </span>
              </div>

              <div style={{ marginBottom: "0.5rem" }}>
                <span style={{ color: "#f59e0b", marginRight: "0.5rem" }}>
                  {getRatingStars(review.rating)}
                </span>
                <span style={{ fontSize: "0.875rem", color: "#64748b" }}>
                  {review.rating}/5
                </span>
              </div>

              <p style={{ fontSize: "0.875rem", color: "#0f172a", marginBottom: "1rem" }}>
                {review.comment}
              </p>

              {review.status === "reported" && review.reportReason && (
                <div
                  style={{
                    padding: "0.75rem",
                    background: "#fef2f2",
                    border: "1px solid #fecaca",
                    borderRadius: "6px",
                    marginBottom: "1rem",
                  }}
                >
                  <p style={{ fontSize: "0.75rem", color: "#991b1b", marginBottom: "0.25rem", fontWeight: 600 }}>
                    신고 사유
                  </p>
                  <p style={{ fontSize: "0.875rem", color: "#7f1d1d", marginBottom: "0.25rem" }}>
                    {review.reportReason}
                  </p>
                  {review.reportedBy && (
                    <p style={{ fontSize: "0.75rem", color: "#991b1b" }}>
                      신고자: {review.reportedBy} · {review.reportedAt || review.date}
                    </p>
                  )}
                </div>
              )}

              {review.reply && (
                <div
                  style={{
                    padding: "0.75rem",
                    background: "#f1f5f9",
                    borderRadius: "6px",
                    marginBottom: "1rem",
                  }}
                >
                  <p style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "0.25rem" }}>
                    관리자 답변
                  </p>
                  <p style={{ fontSize: "0.875rem", color: "#0f172a" }}>{review.reply}</p>
                </div>
              )}

              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <button
                  className="btn btn-danger"
                  onClick={() => openConfirmDialog(review.id, "approve")}
                >
                  신고 승인 (리뷰 삭제)
                </button>
                <button
                  className="btn"
                  style={{ backgroundColor: "#10b981", color: "#ffffff" }}
                  onClick={() => openConfirmDialog(review.id, "reject")}
                >
                  신고 거부 (리뷰 복원)
                </button>
              </div>
            </div>
            ))
          )}
        </div>
      </div>

      <AlertModal
        isOpen={alertModal.isOpen}
        message={alertModal.message}
        type={alertModal.type}
        onClose={() => setAlertModal({ isOpen: false, message: "", type: "info" })}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.action === "approve" ? "리뷰 삭제" : "신고 거부"}
        message={
          confirmDialog.action === "approve"
            ? "해당 리뷰를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
            : "신고를 거부하면 해당 리뷰가 복원됩니다. 계속하시겠습니까?"
        }
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmDialog({ isOpen: false, reviewId: null, action: null })}
        confirmText={confirmDialog.action === "approve" ? "삭제" : "거부"}
        cancelText="취소"
      />
    </div>
  );
};

export default AdminReviewListPage;

