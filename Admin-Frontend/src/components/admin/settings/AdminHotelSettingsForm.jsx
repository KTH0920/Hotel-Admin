import { useState, useEffect } from "react";

const FACILITY_OPTIONS = [
  { value: "spa", label: "스파/월풀", icon: "🛁" },
  { value: "wifi", label: "무선인터넷", icon: "📶" },
  { value: "parking", label: "주차장", icon: "🚗" },
  { value: "halfBath", label: "반신욕", icon: "✔️" },
  { value: "mirrorRoom", label: "거울룸", icon: "🪞" },
  { value: "twinBed", label: "트윈베드", icon: "🛏️" },
  { value: "karaoke", label: "노래방", icon: "🎤" },
  { value: "couplePc", label: "커플 PC", icon: "🖥️" },
  { value: "gamingPc", label: "게이밍PC", icon: "🎮" },
];

const AdminHotelSettingsForm = ({ hotel, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    policies: "",
    amenities: [],
  });

  useEffect(() => {
    if (hotel) {
      setFormData({
        name: hotel.name || "",
        description: hotel.description || "",
        address: hotel.address || "",
        phone: hotel.phone || "",
        email: hotel.email || "",
        policies: hotel.policies || "",
        amenities: hotel.amenities || [],
      });
    }
  }, [hotel]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleAmenity = (value) => {
    setFormData((prev) => {
      const exists = prev.amenities.includes(value);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((item) => item !== value)
          : [...prev.amenities, value],
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h4>호텔 정보</h4>

      <div className="form-group">
        <label>호텔명</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>호텔 소개</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
        />
      </div>

      <div className="form-group">
        <label>주소</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>연락처</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>이메일</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>이용 정책</label>
        <textarea
          name="policies"
          value={formData.policies}
          onChange={handleChange}
          rows={4}
          placeholder="호텔 이용 정책을 입력하세요..."
        />
      </div>

      <div className="form-group">
        <label>부대시설</label>
        <div className="facility-selector">
          {FACILITY_OPTIONS.map((facility) => {
            const selected = formData.amenities.includes(facility.value);
            return (
              <button
                type="button"
                key={facility.value}
                className={`facility-item ${selected ? "selected" : ""}`}
                onClick={() => toggleAmenity(facility.value)}
                aria-pressed={selected}
              >
                <span className="facility-icon">{facility.icon}</span>
                <span className="facility-label">{facility.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          저장
        </button>
      </div>
    </form>
  );
};

export default AdminHotelSettingsForm;

