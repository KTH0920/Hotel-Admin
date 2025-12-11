#!/usr/bin/env node

/**
 * 회원가입 사용자 관리 스크립트
 * 
 * 사용법:
 *   node scripts/manage-users.js list          - 사용자 목록 조회
 *   node scripts/manage-users.js delete <email> - 특정 이메일 사용자 삭제
 *   node scripts/manage-users.js clear         - 모든 사용자 삭제
 */

const fs = require('fs');
const path = require('path');

const STORAGE_FILE = path.join(__dirname, '../local-storage-backup.json');

// localStorage 데이터 파일 읽기
function loadStorage() {
  if (!fs.existsSync(STORAGE_FILE)) {
    return { mockRegisteredUsers: [] };
  }
  try {
    return JSON.parse(fs.readFileSync(STORAGE_FILE, 'utf8'));
  } catch (error) {
    return { mockRegisteredUsers: [] };
  }
}

// localStorage 데이터 파일 저장
function saveStorage(data) {
  fs.writeFileSync(STORAGE_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// 사용자 목록 조회
function listUsers() {
  const storage = loadStorage();
  const users = storage.mockRegisteredUsers || [];
  
  if (users.length === 0) {
    console.log('등록된 사용자가 없습니다.');
    return;
  }
  
  console.log(`\n총 ${users.length}명의 사용자가 등록되어 있습니다.\n`);
  console.table(users.map(u => ({
    이름: u.name,
    이메일: u.email,
    핸드폰: u.phone,
    사업자번호: u.businessNumber,
    가입일: u.createdAt ? new Date(u.createdAt).toLocaleString('ko-KR') : '-'
  })));
}

// 특정 사용자 삭제
function deleteUser(email) {
  if (!email) {
    console.error('이메일을 입력해주세요.');
    console.log('사용법: node scripts/manage-users.js delete <email>');
    return;
  }
  
  const storage = loadStorage();
  const users = storage.mockRegisteredUsers || [];
  const beforeCount = users.length;
  
  storage.mockRegisteredUsers = users.filter(u => u.email !== email);
  const afterCount = storage.mockRegisteredUsers.length;
  
  if (beforeCount === afterCount) {
    console.log(`이메일 "${email}"에 해당하는 사용자를 찾을 수 없습니다.`);
    return;
  }
  
  saveStorage(storage);
  console.log(`사용자 "${email}"가 삭제되었습니다. (${beforeCount}명 → ${afterCount}명)`);
}

// 모든 사용자 삭제
function clearUsers() {
  const storage = loadStorage();
  const count = (storage.mockRegisteredUsers || []).length;
  
  storage.mockRegisteredUsers = [];
  saveStorage(storage);
  
  console.log(`모든 사용자(${count}명)가 삭제되었습니다.`);
}

// 메인 실행
const command = process.argv[2];
const arg = process.argv[3];

switch (command) {
  case 'list':
    listUsers();
    break;
  case 'delete':
    deleteUser(arg);
    break;
  case 'clear':
    clearUsers();
    break;
  default:
    console.log(`
회원가입 사용자 관리 스크립트

사용법:
  node scripts/manage-users.js list              - 사용자 목록 조회
  node scripts/manage-users.js delete <email>    - 특정 이메일 사용자 삭제
  node scripts/manage-users.js clear             - 모든 사용자 삭제

예시:
  node scripts/manage-users.js list
  node scripts/manage-users.js delete example@gmail.com
  node scripts/manage-users.js clear
    `);
    break;
}

