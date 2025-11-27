import Room from './model.js';
import Lodging from '../lodging/model.js'; // ⚠️ 숙소 존재 여부 확인용

// 서비스 1: 객실 생성
export const createRoom = async (data) => {
    const { lodgingId, name, price, capacity, images } = data;

    // 숙소가 존재하는지 확인
    const lodging = await Lodging.findById(lodgingId);
    if (!lodging) {
        throw new Error('숙소를 찾을 수 없습니다.');
    }

    // 객실 생성
    const room = await Room.create({
        lodging: lodgingId,
        name,
        price,
        capacity,
        images
    });
    return room;
};

// 서비스 2: 특정 숙소의 모든 객실 조회
export const getRoomsByLodgingId = async (lodgingId) => {
    const rooms = await Room.find({ lodging: lodgingId });
    return rooms;
};

// 서비스 3: 객실 수정
export const updateRoom = async (roomId, data) => {
    const room = await Room.findByIdAndUpdate(roomId, data, { new: true });
    if (!room) {
        throw new Error('객실을 찾을 수 없습니다.');
    }
    return room;
};

// 서비스 4: 객실 삭제
export const deleteRoom = async (roomId) => {
    const room = await Room.findByIdAndDelete(roomId);
    if (!room) {
        throw new Error('객실을 찾을 수 없습니다.');
    }
    return room;
};

// 서비스 5: 객실 상세 조회 (단일)
export const getRoomById = async (roomId) => {
    const room = await Room.findById(roomId);
    if (!room) {
        throw new Error('객실을 찾을 수 없습니다.');
    }
    return room;
};