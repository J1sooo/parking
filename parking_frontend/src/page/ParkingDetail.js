import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLocation } from '../redux/locationSlice';

function ParkingDetail() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { prkplceNo } = useParams();
    const [parkingDetail, setParkingDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchParkingDetail = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/parking/${prkplceNo}`);
                const data = await response.json();
                setParkingDetail(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchParkingDetail();
    }, [prkplceNo]);

    const handleMapView = () => {
        // 위치 정보 저장
        dispatch(setLocation({
            latitude: parkingDetail.latitude,
            longitude: parkingDetail.longitude,
            source: 'parkingDetailSearch'
        }));
        navigate(`/search/${parkingDetail.prkplceNm}?from=${parkingDetail.prkplceNo}`);
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <span className="loading loading-spinner loading-lg text-blue-400"></span>
        </div>
    );
    if (error) return (
        <div className="flex justify-center items-center h-screen">
            <div className="alert alert-error">
                <span>{error}</span>
            </div>
        </div>
    );
    if (!parkingDetail) return (
        <div className="flex justify-center items-center h-screen">
            <div className="alert alert-warning">
                <span>주차장 정보를 찾을 수 없습니다</span>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto p-4 max-w-5xl">
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    {/* 기본 정보 */}
                    <div className="flex justify-between items-center mb-2">
                        <h1 className="card-title text-3xl font-bold text-primary">{parkingDetail.prkplceNm}</h1>
                        <button 
                            onClick={handleMapView}
                            className="btn btn-primary btn-outline gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                            지도보기
                        </button>
                    </div>
                    <div className="flex gap-2 mb-4">
                        <div className="badge badge-primary">{parkingDetail.prkplceSe}</div>
                        <div className="badge badge-secondary">{parkingDetail.prkplceType}</div>
                    </div>

                    {/* 주소 정보 */}
                    <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
                        <div className="stat">
                            <div className="stat-title flex items-center gap-2 text-base font-bold text-black">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                도로명 주소
                            </div>
                            <div className="stat-value text-base font-normal text-gray-600">{parkingDetail.rdnmadr || '정보 없음'}</div>
                        </div>
                        <div className="stat">
                            <div className="stat-title flex items-center gap-2 text-base font-bold text-black">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                </svg>
                                지번 주소
                            </div>
                            <div className="stat-value text-base font-normal text-gray-600">{parkingDetail.lnmadr || '정보 없음'}</div>
                        </div>
                    </div>

                    {/* 주차장 상세 정보 */}
                    <div className="divider">주차장 상세</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <p><span className="font-semibold">주차구획수:</span> {parkingDetail.prkcmprt}</p>
                            <p><span className="font-semibold">급지구분:</span> {parkingDetail.feedingSe}</p>
                            <p><span className="font-semibold">부제시행구분:</span> {parkingDetail.enforceSe}</p>
                            <p><span className="font-semibold">운영요일:</span> {parkingDetail.operDay}</p>
                            <p><span className="font-semibold">장애인전용구역:</span> {parkingDetail.pwdbsPpkZoneYn}</p>
                        </div>
                    </div>

                    {/* 운영 시간 */}
                    <div className="divider">운영 시간</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="card bg-base-200">
                            <div className="card-body p-4">
                                <h3 className="card-title text-sm">평일</h3>
                                <p>{parkingDetail.weekdayOperOpenHhmm} - {parkingDetail.weekdayOperCloseHhmm}</p>
                            </div>
                        </div>
                        <div className="card bg-base-200">
                            <div className="card-body p-4">
                                <h3 className="card-title text-sm">토요일</h3>
                                <p>{parkingDetail.satOperOpenHhmm} - {parkingDetail.satOperCloseHhmm}</p>
                            </div>
                        </div>
                        <div className="card bg-base-200">
                            <div className="card-body p-4">
                                <h3 className="card-title text-sm">공휴일</h3>
                                <p>{parkingDetail.holidayOperOpenHhmm} - {parkingDetail.holidayCloseHhmm}</p>
                            </div>
                        </div>
                    </div>

                    {/* 요금 정보 */}
                    <div className="divider">요금 정보</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <ul className="space-y-3">
                                <li><span className="font-semibold">요금정보:</span> {parkingDetail.parkingchrgeInfo}</li>
                                <li><span className="font-semibold">기본시간:</span> {parkingDetail.basicTime}</li>
                                <li><span className="font-semibold">기본요금:</span> {parkingDetail.basicCharge}</li>
                                <li><span className="font-semibold">추가단위시간:</span> {parkingDetail.addUnitTime}</li>
                                <li><span className="font-semibold">추가단위요금:</span> {parkingDetail.addUnitCharge}</li>
                            </ul>
                        </div>
                        <div>
                            <ul className="space-y-3">
                                <li><span className="font-semibold">1일주차권 적용시간:</span> {parkingDetail.dayCmmtktAdjTime}</li>
                                <li><span className="font-semibold">1일주차권 요금:</span> {parkingDetail.dayCmmtkt}</li>
                                <li><span className="font-semibold">월정기권 요금:</span> {parkingDetail.monthCmmtkt}</li>
                                <li><span className="font-semibold">결제방법:</span> {parkingDetail.metpay}</li>
                            </ul>
                        </div>
                    </div>

                    {/* 관리 정보 */}
                    <div className="divider">관리 정보</div>
                    <div className="grid grid-cols-1 gap-4">
                        <p><span className="font-semibold">관리기관명:</span> {parkingDetail.institutionNm}</p>
                        <p><span className="font-semibold">전화번호:</span> {parkingDetail.phoneNumber}</p>
                        <p><span className="font-semibold">제공기관명:</span> {parkingDetail.instt_nm}</p>
                        <p><span className="font-semibold">데이터기준일자:</span> {parkingDetail.referenceDate}</p>
                    </div>

                    {/* 특이사항 */}
                    {parkingDetail.spcmnt && (
                        <div className="mt-6">
                            <div className="divider">특이사항</div>
                            <div className="alert alert-info">
                                {parkingDetail.spcmnt}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ParkingDetail; 